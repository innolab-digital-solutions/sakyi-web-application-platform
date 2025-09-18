"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { handleAuthRedirect, isAuthenticated } from "@/lib/auth-utils";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * AuthGuard component that handles client-side authentication routing
 * This works alongside the middleware for comprehensive protection
 */
export default function AuthGuard({ children, requireAuth = true, redirectTo }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { loading: authLoading, isAuthenticated: contextAuthenticated } = useAuth();

  useEffect(() => {
    // Mark as client-side rendered to prevent hydration mismatches
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      // For login page with requireAuth=false, only check if user is already authenticated
      if (!requireAuth && pathname === "/admin/login") {
        // Quick check without waiting for full auth context loading
        const authenticated = isAuthenticated();
        if (authenticated) {
          console.log("🚫 AuthGuard: Authenticated user on login page, redirecting to overview");
          router.replace("/admin/overview");
          return;
        }
        // If not authenticated, show login page immediately
        setIsChecking(false);
        return;
      }

      // For protected routes, check authentication status
      const hasToken = isAuthenticated();

      // If no token, redirect immediately without waiting for auth context
      if (requireAuth && !hasToken) {
        const loginUrl = redirectTo || "/admin/login";
        console.log(`🔒 AuthGuard: No token found, redirecting to: ${loginUrl}`);
        router.replace(loginUrl);
        return;
      }

      // If we have a token, wait for auth context to finish loading for validation
      if (hasToken && authLoading) {
        // Set a timeout to avoid infinite loading
        const timeout = setTimeout(() => {
          console.log("⏰ AuthGuard: Auth context loading timeout, proceeding with token");
          setIsChecking(false);
        }, 3000); // 3 second max wait

        return () => clearTimeout(timeout);
      }

      // Auth context finished loading or no token
      if (!authLoading || !hasToken) {
        const authenticated = contextAuthenticated || hasToken;
        const redirectUrl = handleAuthRedirect(pathname);

        console.log("🔍 AuthGuard check:", {
          pathname,
          authenticated,
          requireAuth,
          redirectUrl,
          authLoading,
        });

        if (redirectUrl) {
          console.log(`🔄 AuthGuard redirecting to: ${redirectUrl}`);
          router.replace(redirectUrl);
          return;
        }

        // If route requires auth but user is not authenticated
        if (requireAuth && !authenticated) {
          const loginUrl = redirectTo || "/admin/login";
          console.log(
            `🔒 AuthGuard: Unauthenticated access to protected route, redirecting to: ${loginUrl}`,
          );
          router.replace(loginUrl);
          return;
        }

        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isClient, authLoading, contextAuthenticated, pathname, requireAuth, redirectTo, router]);

  // Show loading while checking authentication
  // Only show loading for protected routes or when actually checking auth
  const shouldShowLoading = !isClient || (isChecking && requireAuth);

  if (shouldShowLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="relative">
          <div className="from-primary/10 via-accent/10 absolute -inset-16 animate-pulse rounded-full bg-gradient-to-tr to-blue-300/10 blur-xl" />
          <div className="relative z-10 flex flex-col items-center rounded-2xl border border-white/40 bg-white/80 px-8 py-7 text-center shadow-xl backdrop-blur-xl">
            <div className="relative mb-4">
              <div className="from-primary/20 via-accent/20 absolute inset-0 rounded-full bg-gradient-to-tr to-blue-300/20 blur-lg" />
              <div className="relative rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
                <Loader2 className="text-primary h-7 w-7 animate-spin" />
              </div>
            </div>

            <h2 className="text-base font-semibold tracking-tight text-gray-800">
              Verifying access
            </h2>
            <p className="mt-1.5 max-w-xs text-xs text-gray-500">
              Please wait a moment while we confirm your session and route permissions.
            </p>

            <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-gray-200">
              <div className="from-primary via-accent h-full w-1/3 animate-[shimmer_1.2s_ease_infinite] rounded-full bg-gradient-to-r to-blue-400" />
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-150%);
            }
            50% {
              transform: translateX(50%);
            }
            100% {
              transform: translateX(150%);
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAuth?: boolean; redirectTo?: string } = {},
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard requireAuth={options.requireAuth} redirectTo={options.redirectTo}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

/**
 * Hook for checking authentication status
 */
export function useAuthGuard() {
  const [isChecking, setIsChecking] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { loading: authLoading, isAuthenticated: contextAuthenticated } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      if (authLoading) return;

      const redirectUrl = handleAuthRedirect(pathname);

      if (redirectUrl) {
        router.replace(redirectUrl);
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isClient, authLoading, contextAuthenticated, pathname, router]);

  return {
    isChecking: !isClient || isChecking || authLoading,
    isAuthenticated: contextAuthenticated || isAuthenticated(),
    isClient,
  };
}
