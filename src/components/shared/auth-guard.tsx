/* eslint-disable unicorn/no-document-cookie */
"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";
import { getStoredToken, isAuthenticated } from "@/utils/auth/storage";

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

  // Sync tokens to cookies on route changes for SSR compatibility
  useEffect(() => {
    if (globalThis.window === undefined) return;

    const { token, expiresAt, isValid } = getStoredToken();

    if (isValid && token && expiresAt) {
      // Calculate remaining time in seconds for cookie max-age
      const maxAge = Math.floor((expiresAt - Date.now()) / 1000);
      // Set secure cookies for token persistence across SSR/client boundaries
      document.cookie = `access-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `token-expires-at=${expiresAt}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } else {
      // Clear invalid/expired tokens by setting past expiration date
      document.cookie = "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "token-expires-at=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [pathname]);

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

      // Handle login page - redirect authenticated users to dashboard
      if (pathname === loginPath) {
        if (userAuthenticated) {
          router.replace(dashboardPath);
          return;
        }
        setIsChecking(false);
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

    // Wait for auth context to load, with timeout to prevent infinite loading
    if (contextLoading) {
      // Set maximum wait time to avoid hanging on auth context loading
      const timeout = setTimeout(() => {
        checkAndRedirect();
      }, 3000); // 3 second max wait for auth context

      return () => clearTimeout(timeout);
    }

    // Auth context is ready, proceed with checks
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
                <Loader2 className="text-primary h-7 w-7 animate-spin" />
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
