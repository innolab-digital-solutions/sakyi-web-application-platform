"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import {
  type AuthContextType,
  authService,
  clearStoredToken,
  createTokenHelpers,
  getStoredToken,
  type LoginCredentials,
  RetryManager,
  setStoredToken,
  type User,
  AuthenticatedResponse,
} from "@/lib/auth";
import { PATHS } from "@/lib/config/paths";
import { ApiResponse } from "@/types/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management
  const [token, setToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | undefined>();
  const [isHydrated, setIsHydrated] = useState(false);

  // Navigation
  const router = useRouter();
  const pathname = usePathname();

  // Refs for managing state
  const refreshing = useRef(false);
  const refreshTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const retryManager = useRef(new RetryManager());

  // Token helper functions
  const tokenHelpers = createTokenHelpers(tokenExpiresAt || 0);

  // Clear all authentication data
  const clearAuthData = useCallback(() => {
    setToken(undefined);
    setUser(undefined);
    setTokenExpiresAt(undefined);
    retryManager.current.resetRetry();
    clearStoredToken();

    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
      refreshTimeout.current = undefined;
    }
  }, []);

  // Set token with expiry and persistence
  const setTokenWithExpiry = useCallback((newToken: string, expiresInSeconds: number) => {
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    setToken(newToken);
    setTokenExpiresAt(expiresAt);
    setStoredToken(newToken, expiresAt);
  }, []);

  // Schedule automatic refresh
  const scheduleRefresh = useCallback((expiresInSeconds: number) => {
    const refreshDelay = Math.max((expiresInSeconds - 120) * 1000, 30_000);

    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    refreshTimeout.current = setTimeout(() => {
      refresh();
    }, refreshDelay);
  }, []);

  // Refresh token with full retry logic
  const refresh = useCallback(async (): Promise<string | undefined> => {
    if (refreshing.current) return undefined;

    refreshing.current = true;
    setLoading(true);

    try {
      const response = await authService.refresh();

      if (response.status === "success" && response.data) {
        const { tokens, user: userData } = response.data.data;

        setTokenWithExpiry(tokens.access.token, tokens.access.expires_in_seconds);
        setUser(userData);
        retryManager.current.resetRetry();
        scheduleRefresh(tokens.access.expires_in_seconds);

        return tokens.access.token;
      } else {
        throw new Error(response.message || "Token refresh failed");
      }
    } catch (error) {
      const { shouldRetry, delay } = retryManager.current.shouldRetryWithDelay();

      if (shouldRetry) {
        setTimeout(() => {
          refresh();
        }, delay);
      } else {
        clearAuthData();

        if (pathname !== PATHS.ADMIN.LOGIN) router.push(PATHS.ADMIN.LOGIN);
      }

      return undefined;
    } finally {
      refreshing.current = false;
      setLoading(false);
    }
  }, [clearAuthData, router, pathname, setTokenWithExpiry, scheduleRefresh]);

  // Smart refresh with cooldown protection
  const smartRefresh = useCallback(async (): Promise<string | undefined> => {
    if (!retryManager.current.canRefresh()) {
      return token;
    }

    retryManager.current.markRefreshAttempt();
    return await refresh();
  }, [token, refresh]);

  // Global API error handler for 401/419 responses
  const handleApiError = useCallback(
    async (error: unknown) => {
      const errorObject = error as { status?: number; response?: { status?: number } };
      const status = errorObject?.status || errorObject?.response?.status;

      if (status === 401 || status === 419) {
        setLoading(true);
        try {
          return await smartRefresh();
        } finally {
          setLoading(false);
        }
      }
      return;
    },
    [smartRefresh],
  );

  // Login method with full error handling
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const response = await authService.login(credentials);

        if (response.status === "success" && response.data) {
          const { tokens, user: userData } = response.data.data;

          setTokenWithExpiry(tokens.access.token, tokens.access.expires_in_seconds);
          setUser(userData);
          retryManager.current.resetRetry();
          scheduleRefresh(tokens.access.expires_in_seconds);
        }

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Network error occurred";
        return {
          status: "error" as const,
          message: "Network error. Please check your connection.",
          errors: { system: [errorMessage] },
        };
      } finally {
        setLoading(false);
      }
    },
    [setTokenWithExpiry, scheduleRefresh],
  );

  // Logout with cleanup
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.warn("⚠️ Logout request failed:", error);
    } finally {
      clearAuthData();

      if (globalThis.window !== undefined) {
        localStorage.setItem("logout-signal", Date.now().toString());
        localStorage.removeItem("logout-signal");
      }

      if (pathname !== PATHS.ADMIN.LOGIN) router.push(PATHS.ADMIN.LOGIN);

      setLoading(false);
    }
  }, [token, router, clearAuthData, pathname]);

  // Hydration effect - prevent SSR mismatches
  useEffect(() => {
    setIsHydrated(true);
    const stored = getStoredToken();
    if (stored.token && stored.expiresAt) {
      setToken(stored.token);
      setTokenExpiresAt(stored.expiresAt);
    }
  }, []);

  // Complex session initialization with all scenarios
  useEffect(() => {
    if (!isHydrated) return;

    let mounted = true;

    const initSession = async () => {
      if (refreshing.current || !mounted) return;


      try {
        // CASE 1: We have a valid stored token
        if (token && tokenExpiresAt) {
          const timeUntilExpiry = tokenExpiresAt - Date.now();

          if (timeUntilExpiry > 120_000) {
            // More than 2 minutes left
            console.log(
              `🎫 Token valid for ${Math.round(timeUntilExpiry / 60_000)} minutes, validating...`
            );

            // If we already have user data, skip the /me call
            if (user) {
              console.log("✅ User data already available, skipping /me call");
              scheduleRefresh(Math.floor(timeUntilExpiry / 1000));
              setLoading(false);
              return;
            }

            try {
              setLoading(true);
              const meRes = await authService.me(token);

              if (meRes.status === "success" && meRes.data && mounted) {
                console.log("✅ Token validation successful");
                setUser(meRes.data);
                scheduleRefresh(Math.floor(timeUntilExpiry / 1000));
                setLoading(false);
                return;
              }
            } catch {
              console.log("🔒 Token validation failed, clearing token");
              if (mounted) {
                clearAuthData();
                setLoading(false);
              }
              return;
            }
          } else {
            console.log("🕐 Token expires soon, clearing and will try refresh");
            if (mounted) clearAuthData();
          }
        }

        // CASE 2: No token or token invalid, try refresh from httpOnly cookie
        if (pathname === PATHS.ADMIN.LOGIN) {
          console.log("🚫 On login page, skipping refresh attempt");
          if (mounted) clearAuthData();
          return;
        }

        // Check if localStorage has any auth data at all
        const hasAnyAuthData =
          globalThis.window !== undefined &&
          (localStorage.getItem("access-token") || localStorage.getItem("token-expires-at"));

        if (!hasAnyAuthData) {
          console.log("🚫 No auth data in localStorage, skipping refresh attempt");
          if (mounted) clearAuthData();
          return;
        }

        console.log("👤 No valid token, attempting refresh from cookie...");

        if (refreshing.current || !mounted) return;
        refreshing.current = true;
        setLoading(true);

        try {
          const refreshRes = await authService.refresh();

          if (refreshRes.status === "success" && refreshRes.data && mounted) {
            console.log("✅ Session restored via refresh");

            const { tokens, user: userData } = refreshRes.data;
            setTokenWithExpiry(tokens.access.token, tokens.access.expires_in_seconds);
            setUser(userData);
            scheduleRefresh(tokens.access.expires_in_seconds);
          } else {
            console.log("👤 No valid refresh token found");
            if (mounted) clearAuthData();
          }
        } catch {
          console.log("👤 Refresh failed");
          if (mounted) clearAuthData();
        } finally {
          refreshing.current = false;
          setLoading(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    return () => {
      mounted = false;
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
        refreshTimeout.current = null;
      }
    };
  }, [
    isHydrated,
    token,
    tokenExpiresAt,
    user,
    clearAuthData,
    setTokenWithExpiry,
    scheduleRefresh,
    pathname,
  ]);

  // Cross-tab logout synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "logout-signal") {
        console.log("🔄 Cross-tab logout detected");
        clearAuthData();
        if (pathname !== PATHS.ADMIN.LOGIN) {
          router.push(PATHS.ADMIN.LOGIN);
        }
      }
    };

    if (globalThis.window !== undefined) {
      globalThis.addEventListener("storage", handleStorageChange);
      return () => globalThis.removeEventListener("storage", handleStorageChange);
    }
  }, [router, clearAuthData, pathname]);

  // Export token helpers for potential future use (maintaining your original structure)
  const _tokenHelpers = tokenHelpers;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refresh,
        handleApiError,
        loading: loading || !isHydrated,
        isAuthenticated: isHydrated && !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};