"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";
import { isAuthenticated } from "@/utils/auth/storage";

interface AuthGuardProperties {
  children: React.ReactNode;
  requireAuth?: boolean;
  loginPath?: string;
  dashboardPath?: string;
}

/**
 * AuthGuard component that provides comprehensive authentication management.
 *
 * Features:
 * - Automatic token synchronization with cookies for SSR compatibility
 * - Route-based authentication protection
 * - Smart redirects for authenticated/unauthenticated users
 * - Loading states during authentication checks
 * - Client-side hydration handling
 *
 * @param children - React nodes to render when authentication passes
 * @param requireAuth - Whether the route requires authentication (default: true)
 * @param loginPath - Path to redirect unauthenticated users (default: PATHS.ADMIN.LOGIN)
 * @param dashboardPath - Path to redirect authenticated users from login page (default: PATHS.ADMIN.OVERVIEW)
 */
export default function AuthGuard({
  children,
  requireAuth = true,
  loginPath = PATHS.ADMIN.LOGIN,
  dashboardPath = PATHS.ADMIN.OVERVIEW,
}: AuthGuardProperties) {
  const [isClient, setIsClient] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const { loading: contextLoading, isAuthenticated: contextAuth } = useAuth();

  // Mark component as client-side rendered to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Main authentication logic with route-based redirects
  useEffect(() => {
    if (!isClient) return;

    /**
     * Performs authentication check and handles route redirects based on auth state.
     * Implements smart routing logic for different authentication scenarios.
     */
    const checkAndRedirect = () => {
      const hasToken = isAuthenticated();
      const userAuthenticated = contextAuth || hasToken;

      // Handle login page immediately without waiting for context loading
      if (pathname === loginPath) {
        if (userAuthenticated) {
          router.replace(dashboardPath);
        } else {
          setIsChecking(false);
        }
        return;
      }

      // Handle protected routes - redirect unauthenticated users to login
      if (requireAuth && !userAuthenticated) {
        router.replace(loginPath);
        return;
      }

      // Handle public routes - no authentication required
      if (!requireAuth) {
        setIsChecking(false);
        return;
      }

      // All authentication checks passed, allow access
      setIsChecking(false);
    };

    // For non-login routes, optionally wait for context but with a timeout fallback
    if (contextLoading) {
      const timeout = setTimeout(() => {
        checkAndRedirect();
      }, 3000);
      return () => clearTimeout(timeout);
    }

    checkAndRedirect();
  }, [
    isClient,
    contextLoading,
    contextAuth,
    pathname,
    requireAuth,
    loginPath,
    dashboardPath,
    router,
  ]);

  // Show loading screen while performing authentication checks
  if (!isClient || isChecking) {
    // Determine appropriate loading message based on current route
    const isLoginPage = pathname === loginPath;
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="relative">
          <div className="from-primary/10 via-accent/10 absolute -inset-16 animate-pulse rounded-full bg-gradient-to-tr to-blue-300/10 blur-xl" />
          <div className="relative z-10 flex flex-col items-center rounded-2xl border border-white/40 bg-white/80 px-8 py-7 text-center shadow-xl backdrop-blur-xl">
            <div className="relative mb-4">
              <div className="from-primary/20 via-accent/20 absolute inset-0 rounded-full bg-gradient-to-tr to-blue-300/20 blur-lg" />
              <div className="relative rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
                <Spinner className="text-primary size-6" />
              </div>
            </div>

            <h2 className="text-base font-semibold tracking-tight text-gray-800">
              {isLoginPage ? "Redirecting to dashboard" : "Verifying access"}
            </h2>
            <p className="mt-1.5 max-w-xs text-xs text-gray-500">
              {isLoginPage
                ? "You are already signed in. Taking you to the right place."
                : "Please wait while we confirm your session and permissions."}
            </p>

            <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-gray-200">
              <div className="from-primary via-accent h-full w-1/3 animate-[shimmer_1.2s_ease_infinite] rounded-full bg-gradient-to-r to-blue-400" />
            </div>
          </div>
        </div>
        <style>{`
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

  // Authentication checks passed, render protected content
  return <>{children}</>;
}
