/**
 * Authentication utilities for client-side token management
 * These functions work with the same token storage system as auth-context.tsx
 */

// Token storage keys (matching auth-context.tsx)
const STORAGE_KEY = "access-token";
const EXPIRY_KEY = "token-expires-at";

// Simple decryption function (matching auth-context.tsx)
const decryptToken = (encryptedToken: string): string | null => {
  if (globalThis.window === undefined) return null;
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
  if (!token || !expiresAt) return false;
  const now = Date.now();
  return now < expiresAt && token.length > 0;
};

/**
 * Get stored token from localStorage
 * Returns null if no token, expired, or invalid
 */
export const getStoredToken = (): {
  token: string | null;
  expiresAt: number | null;
  isValid: boolean;
} => {
  if (globalThis.window === undefined) {
    return { token: null, expiresAt: null, isValid: false };
  }

  try {
    const encryptedToken = localStorage.getItem(STORAGE_KEY);
    const storedExpiry = localStorage.getItem(EXPIRY_KEY);

    if (!encryptedToken || !storedExpiry) {
      return { token: null, expiresAt: null, isValid: false };
    }

    const expiresAt = Number.parseInt(storedExpiry, 10);
    const token = decryptToken(encryptedToken);

    if (!token) {
      return { token: null, expiresAt: null, isValid: false };
    }

    const isValid = isTokenValid(token, expiresAt);

    // Clean up expired token
    if (!isValid) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
    }

    return { token, expiresAt, isValid };
  } catch (error) {
    console.error("❌ Token retrieval error:", error);
    // Clear corrupted storage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return { token: null, expiresAt: null, isValid: false };
  }
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  const { isValid } = getStoredToken();
  return isValid;
};

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = (): Record<string, string> => {
  const { token, isValid } = getStoredToken();

  if (!isValid || !token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
    "x-auth-token": token,
    "x-auth-expiry": getStoredToken().expiresAt?.toString() || "",
  };
};

/**
 * Clear stored authentication data
 */
export const clearAuthData = (): void => {
  if (globalThis.window === undefined) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);

    // Signal cross-tab logout
    localStorage.setItem("logout-signal", Date.now().toString());
    localStorage.removeItem("logout-signal");
  } catch (error) {
    console.error("❌ Error clearing auth data:", error);
  }
};

/**
 * Check if a route requires authentication
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = [
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

  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
};

/**
 * Check if a route is public (doesn't require authentication)
 */
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = ["/admin/login", "/api/auth/login", "/api/auth/refresh", "/api/auth/logout"];

  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
};

/**
 * Get redirect URL after login
 */
export const getRedirectUrl = (pathname: string): string => {
  // If user was trying to access a protected route, redirect there
  if (isProtectedRoute(pathname)) {
    return pathname;
  }

  // Default redirect to overview
  return "/admin/overview";
};

/**
 * Handle authentication redirect logic
 */
export const handleAuthRedirect = (pathname: string): string | null => {
  const authenticated = isAuthenticated();

  // If on login page and authenticated, redirect to overview
  if (pathname === "/admin/login" && authenticated) {
    return "/admin/overview";
  }

  // If on protected route and not authenticated, redirect to login
  if (isProtectedRoute(pathname) && !authenticated) {
    return "/admin/login";
  }

  // If on root admin and authenticated, redirect to overview
  if (pathname === "/admin" && authenticated) {
    return "/admin/overview";
  }

  // If on root admin and not authenticated, redirect to login
  if (pathname === "/admin" && !authenticated) {
    return "/admin/login";
  }

  return null;
};
