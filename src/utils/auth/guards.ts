import { PATHS } from "@/config/paths";

/**
 * Authentication Guards
 *
 * Provides route protection utilities for managing access control and navigation
 * flow in the admin application. These guards determine which routes require
 * authentication and handle automatic redirects based on user state.
 */

/**
 * Determines if a given pathname requires authentication to access
 *
 * @param pathname - The route pathname to check (e.g., "/admin/users")
 * @returns True if the route requires authentication, false otherwise
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = ["/admin/overview"];

  return (
    protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/")) ||
    pathname === "/admin"
  );
};

/**
 * Determines if a given pathname is a public route that doesn't require authentication
 *
 * @param pathname - The route pathname to check (e.g., "/admin/login")
 * @returns True if the route is public, false otherwise
 */
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = ["/admin/login"];
  return publicRoutes.includes(pathname);
};

/**
 * Determines the appropriate redirect URL based on current pathname and authentication status
 *
 * Handles automatic navigation logic for the admin application:
 * - Redirects authenticated users away from login page to overview
 * - Redirects unauthenticated users from protected routes to login
 * - Handles root admin path redirects based on auth state
 *
 * @param pathname - The current route pathname
 * @param isAuthenticated - Whether the user is currently authenticated
 * @returns The redirect URL if a redirect is needed, undefined otherwise
 */
export const getRedirectUrl = (pathname: string, isAuthenticated: boolean): string | undefined => {
  if (pathname === PATHS.ADMIN.LOGIN && isAuthenticated) {
    return PATHS.ADMIN.OVERVIEW;
  }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return PATHS.ADMIN.LOGIN;
  }

  if (pathname === "/admin") {
    return isAuthenticated ? PATHS.ADMIN.OVERVIEW : PATHS.ADMIN.LOGIN;
  }

  return undefined;
};
