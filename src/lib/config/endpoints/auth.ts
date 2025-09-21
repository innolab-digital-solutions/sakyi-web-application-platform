/**
 * Authentication API endpoints
 * Handle user login, logout, token refresh, and profile data
 *
 * @returns The authentication API endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
} as const;
