/**
 * Authentication API endpoints
 *
 * Handle user login, logout, token refresh, and profile data
 */
export const AUTH_API = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
} as const;
