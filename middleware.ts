import { NextRequest, NextResponse } from "next/server";

// Route patterns
const PUBLIC_ROUTES = [
  "/admin/login",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
];

const PROTECTED_ROUTES = [
  "/admin",
  "/admin/overview",
  "/admin/enrollments",
  "/admin/reports",
  "/admin/audit-logs",
  "/admin/team-management",
  "/admin/staff",
  "/admin/roles",
  "/admin/programs",
  "/admin/clients",
  "/admin/settings",
];

// Token storage keys (matching auth-context.tsx)
const STORAGE_KEY = "access-token";
const EXPIRY_KEY = "token-expires-at";

// Simple decryption function (matching auth-context.tsx)
const decryptToken = (encryptedToken: string): string | null => {
  try {
    const decoded = atob(encryptedToken);
    const parts = decoded.split("_sakyi_salt_v1");
    return parts[0] || null;
  } catch {
    return null;
  }
};

// Check if token is valid and not expired
const isTokenValid = (token: string, expiresAt: number): boolean => {
  const now = Date.now();
  return now < expiresAt && token.length > 0;
};

// Get token from request headers (for server-side validation)
const getTokenFromRequest = (
  request: NextRequest
): { token: string | null; expiresAt: number | null } => {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    // For middleware, we'll assume token is valid if it exists
    // The actual validation will happen in the API calls
    return { token, expiresAt: Date.now() + 3600000 }; // 1 hour default
  }

  // Try to get from cookies (if using httpOnly cookies)
  const tokenCookie = request.cookies.get("access-token");
  const expiryCookie = request.cookies.get("token-expires-at");

  if (tokenCookie && expiryCookie) {
    const expiresAt = parseInt(expiryCookie.value, 10);
    if (isTokenValid(tokenCookie.value, expiresAt)) {
      return { token: tokenCookie.value, expiresAt };
    }
  }

  return { token: null, expiresAt: null };
};

// Check if route is public
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

// Check if route is protected
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

// Check if user is authenticated (for client-side routes)
const isAuthenticated = (request: NextRequest): boolean => {
  // Check cookies (set by AuthHeadersProvider)
  const tokenCookie = request.cookies.get("access-token");
  const expiryCookie = request.cookies.get("token-expires-at");

  if (tokenCookie && expiryCookie) {
    const expiresAt = parseInt(expiryCookie.value, 10);
    return isTokenValid(tokenCookie.value, expiresAt);
  }

  // Fallback: check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    // For middleware, we'll assume token is valid if it exists
    // The actual validation will happen in the API calls
    return token.length > 0;
  }

  return false;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`🔍 Middleware: ${request.method} ${pathname}`);

  // Skip middleware for static files, API routes (except auth), and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Handle API auth routes
  if (pathname.startsWith("/api/auth")) {
    // Allow all auth API routes to pass through
    return NextResponse.next();
  }

  // Check if user is authenticated
  const authenticated = isAuthenticated(request);

  // Handle login page
  if (pathname === "/admin/login") {
    if (authenticated) {
      console.log(
        "🚫 Authenticated user trying to access login, redirecting to overview"
      );
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    return NextResponse.next();
  }

  // Handle protected admin routes
  if (isProtectedRoute(pathname)) {
    if (!authenticated) {
      console.log(
        "🔒 Unauthenticated user trying to access protected route, redirecting to login"
      );
      // Store the intended destination for redirect after login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Handle root admin route
  if (pathname === "/admin") {
    if (authenticated) {
      console.log(
        "🏠 Redirecting authenticated user from /admin to /admin/overview"
      );
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    } else {
      console.log("🔒 Redirecting unauthenticated user from /admin to login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Allow all other routes to pass through
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
