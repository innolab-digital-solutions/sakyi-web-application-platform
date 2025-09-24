import { NextRequest, NextResponse } from "next/server";

import { PATHS } from "@/config/paths";
import { isProtectedRoute } from "@/utils/auth/guards";

/**
 * Checks if the user is authenticated based on request cookies or authorization header
 *
 * @param request - The incoming Next.js request object
 * @returns True if user has valid authentication credentials, false otherwise
 */
const isAuthenticated = (request: NextRequest): boolean => {
  const tokenCookie = request.cookies.get("access_token");
  const expiryCookie = request.cookies.get("access_expires_at");

  if (!tokenCookie || !expiryCookie) return false;

  const expiresAt = Number.parseInt(expiryCookie.value, 10);
  if (Number.isNaN(expiresAt)) return false;

  return Date.now() < expiresAt && tokenCookie.value.length > 0;
};

/**
 * Next.js middleware for handling authentication and route protection
 *
 * Manages access control for admin routes by:
 * - Redirecting authenticated users away from login page
 * - Protecting admin routes requiring authentication
 * - Handling root admin path redirects based on auth state
 *
 * @param request - The incoming Next.js request object
 * @returns NextResponse with appropriate redirect or continuation
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authenticated = isAuthenticated(request);

  if (pathname === PATHS.ADMIN.LOGIN) {
    if (authenticated) {
      return NextResponse.redirect(new URL(PATHS.ADMIN.OVERVIEW, request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    if (!authenticated) {
      const loginUrl = new URL(PATHS.ADMIN.LOGIN, request.url);
      // Preserve original destination for post-login redirect
      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === PATHS.ADMIN.ROOT) {
    return authenticated
      ? NextResponse.redirect(new URL(PATHS.ADMIN.OVERVIEW, request.url))
      : NextResponse.redirect(new URL(PATHS.ADMIN.LOGIN, request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware configuration specifying which routes to intercept
 *
 * Excludes static assets, images, and Next.js internal files from middleware processing
 * to optimize performance and prevent unnecessary authentication checks.
 */
export const config = {
  matcher: [
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
