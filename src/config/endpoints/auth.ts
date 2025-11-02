/**
 * Authentication API endpoints
 *
 * Laravel Sanctum SPA authentication endpoints using session-based auth
 * with CSRF protection. Authentication state is managed via httpOnly cookies.
 *
 * Authentication flow:
 * 1. Call CSRF_COOKIE to initialize CSRF token
 * 2. Call LOGIN with credentials
 * 3. Use ME to verify/refresh session
 * 4. Call LOGOUT to end session
 */
export const AUTH_ENDPOINTS = {
  /** Initialize CSRF cookie (call before login) */
  CSRF_COOKIE: "/sanctum/csrf-cookie",

  /** Authenticate user and establish session */
  LOGIN: "/auth/web/login",

  /** End current session */
  LOGOUT: "/auth/web/logout",

  /** Get current authenticated user */
  ME: "/me",
} as const;
