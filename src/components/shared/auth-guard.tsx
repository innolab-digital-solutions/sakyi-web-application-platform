/* eslint-disable unicorn/no-document-cookie */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LoadingScreen from "@/components/shared/loading-screen";
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
      <LoadingScreen
        title={isLoginPage ? "Redirecting to dashboard" : "Verifying access"}
        description={
          isLoginPage
            ? "You are already signed in. Taking you to the right place."
            : "Please wait while we confirm your session and permissions."
        }
      />
    );
  }

  // Authentication checks passed, render protected content
  return <>{children}</>;
}
