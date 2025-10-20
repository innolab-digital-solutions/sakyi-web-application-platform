import { PATHS } from "@/config/paths";

/**
 * Route protection utilities for Laravel Sanctum authentication
 *
 * Manages access control and navigation flow in the admin application.
 * Auth state is managed via httpOnly cookies by Laravel Sanctum.
 */

/**
 * Checks if route requires authentication
 *
 * @param pathname - Route path to check (e.g., "/admin/users")
 * @returns True if authentication is required
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = [PATHS.ADMIN.OVERVIEW];

  return (
    protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/")) ||
    pathname === PATHS.ADMIN.ROOT
  );
};

/**
 * Checks if route is publicly accessible
 *
 * @param pathname - Route path to check (e.g., "/admin/login")
 * @returns True if route is public
 */
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = [PATHS.ADMIN.LOGIN];

  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
};

/**
 * Determines redirect URL based on auth status
 *
 * Handles automatic navigation:
 * - Authenticated users on login page → overview
 * - Unauthenticated users on protected routes → login
 * - Root admin path → overview (if authenticated) or login
 *
 * @param pathname - Current route path
 * @param isAuthenticated - User authentication status
 * @returns Redirect URL if needed, undefined otherwise
 */
export const getRedirectUrl = (pathname: string, isAuthenticated: boolean): string | undefined => {
  if (pathname === PATHS.ADMIN.LOGIN && isAuthenticated) {
    return PATHS.ADMIN.OVERVIEW;
  }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return PATHS.ADMIN.LOGIN;
  }

  if (pathname === PATHS.ADMIN.ROOT) {
    return isAuthenticated ? PATHS.ADMIN.OVERVIEW : PATHS.ADMIN.LOGIN;
  }

  return undefined;
};
