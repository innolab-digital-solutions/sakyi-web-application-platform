/**
 * Authentication API endpoints for Laravel Sanctum SPA authentication
 *
 * Uses session-based authentication with CSRF protection.
 * No token management required - authentication is handled via httpOnly cookies.
 *
 * @returns The authentication API endpoints
 */
export const AUTH_ENDPOINTS = {
  CSRF_COOKIE: "/sanctum/csrf-cookie",
  LOGIN: "/auth/spa/login",
  LOGOUT: "/auth/spa/logout",
  ME: "/auth/spa/me",
} as const;
