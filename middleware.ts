import { NextRequest, NextResponse } from "next/server";

import { PATHS } from "@/config/paths";
import { isProtectedRoute } from "@/utils/auth/guards";

/**
 * Checks for session cookie presence
 */
const hasSessionCookie = (request: NextRequest): boolean => {
  const sessionCookie = request.cookies.get("sa_kyi_health_wellness_session");
  return !!sessionCookie && sessionCookie.value.length > 0;
};

/**
 * Route protection middleware
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = hasSessionCookie(request);

  if (pathname === PATHS.ADMIN.LOGIN) {
    if (hasSession) {
      return NextResponse.redirect(new URL(PATHS.ADMIN.OVERVIEW, request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    if (!hasSession) {
      const loginUrl = new URL(PATHS.ADMIN.LOGIN, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === PATHS.ADMIN.ROOT) {
    return hasSession
      ? NextResponse.redirect(new URL(PATHS.ADMIN.OVERVIEW, request.url))
      : NextResponse.redirect(new URL(PATHS.ADMIN.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
