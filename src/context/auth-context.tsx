"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { PATHS } from "@/config/paths";
import { authService } from "@/lib/api/services/shared/auth";
import { LoginCredentials, User } from "@/types/admin/auth";
import { AuthContextType } from "@/types/admin/auth";
import { RetryManager } from "@/utils/auth/retry";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/utils/auth/storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | undefined>();
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  /**
   * Redirect to the login route when not already there.
   * Wrapped in a callback to centralize navigation logic.
   */
  const redirectToLoginIfNeeded = useCallback(() => {
    if (pathname !== PATHS.ADMIN.LOGIN) router.push(PATHS.ADMIN.LOGIN);
  }, [pathname, router]);

  const refreshing = useRef(false);
  const refreshTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const retryManager = useRef(new RetryManager());
  // Stable reference to the latest refresh implementation to avoid circular deps in timers
  const refreshFunctionReference = useRef<() => Promise<string | undefined>>(() =>
    Promise.resolve("" as unknown as string | undefined),
  );

  /**
   * Clear all client-side authentication data and cancel any scheduled work.
   *
   * - Resets in-memory token, user, and expiry
   * - Clears persisted token from storage
   * - Resets retry backoff state
   * - Cancels any scheduled token refresh timer
   */
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

  /**
   * Persist the access token along with its expiry and update in-memory state.
   *
   * @param newToken - Sanctum access token
   * @param expiresInSeconds - Number of seconds until the token expires
   */
  const setTokenWithExpiry = useCallback((newToken: string, expiresInSeconds: number) => {
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    setToken(newToken);
    setTokenExpiresAt(expiresAt);
    setStoredToken(newToken, expiresAt);
  }, []);

  /**
   * Schedule an automatic token refresh slightly before expiry.
   * Uses a safety margin of 120s and enforces a minimum delay to avoid thrashing.
   *
   * @param expiresInSeconds - Seconds until the current token expires
   */
  const scheduleRefresh = useCallback((expiresInSeconds: number) => {
    const refreshDelay = Math.max((expiresInSeconds - 120) * 1000, 30_000);

    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    refreshTimeout.current = setTimeout(() => {
      void refreshFunctionReference.current();
    }, refreshDelay);
  }, []);

  /**
   * Attempt to refresh the access token using the server-side session (httpOnly cookie).
   * Includes retry with exponential backoff. On permanent failure, clears auth and redirects to login.
   *
   * @returns The new access token when successful, otherwise undefined
   */
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
    } catch {
      const { shouldRetry, delay } = retryManager.current.shouldRetryWithDelay();

      if (shouldRetry) {
        setTimeout(() => {
          void refreshFunctionReference.current();
        }, delay);
      } else {
        clearAuthData();
        redirectToLoginIfNeeded();
      }

      return undefined;
    } finally {
      refreshing.current = false;
      setLoading(false);
    }
  }, [clearAuthData, setTokenWithExpiry, scheduleRefresh, redirectToLoginIfNeeded]);

  // Sync the refresh ref with the latest implementation
  useEffect(() => {
    refreshFunctionReference.current = refresh;
  }, [refresh]);

  /**
   * Perform a refresh only if allowed by the refresh cool down.
   * Prevents rapid consecutive refresh attempts under failure conditions.
   *
   * @returns The refreshed access token when successful, otherwise the current token or undefined
   */
  const smartRefresh = useCallback(async (): Promise<string | undefined> => {
    if (!retryManager.current.canRefresh()) {
      return token;
    }

    retryManager.current.markRefreshAttempt();
    return await refresh();
  }, [token, refresh]);

  /**
   * Global API error handler for authentication-related responses.
   * On 401/419, attempts a smart refresh; otherwise no-op.
   *
   * @param error - Error object from an HTTP client (e.g., client.ts)
   * @returns The refreshed access token when a refresh is attempted and succeeds; otherwise undefined
   */
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

  /**
   * Authenticate with user credentials and bootstrap the session state on success.
   * Schedules a token refresh and resets retry policy.
   *
   * @param credentials - Login credentials
   * @returns Standardized API response
   */
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

  /**
   * Terminate the session on the server (best-effort) and clear all local state.
   * Also propagates a cross-tab logout signal and redirects to the login page.
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch {
      // Ignore network errors on logout; local cleanup still proceeds
    } finally {
      clearAuthData();

      if (globalThis.window !== undefined) {
        localStorage.setItem("logout-signal", Date.now().toString());
        localStorage.removeItem("logout-signal");
      }

      redirectToLoginIfNeeded();

      setLoading(false);
    }
  }, [token, clearAuthData, redirectToLoginIfNeeded]);

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
            // More than 2 minutes left: validate token by calling /me unless user is already present

            // If we already have user data, skip the /me call
            if (user) {
              scheduleRefresh(Math.floor(timeUntilExpiry / 1000));
              setLoading(false);
              return;
            }

            try {
              setLoading(true);
              const meResponse = await authService.me(token);

              if (meResponse.status === "success" && meResponse.data && mounted) {
                setUser(meResponse.data);
                scheduleRefresh(Math.floor(timeUntilExpiry / 1000));
                setLoading(false);
                return;
              }
            } catch {
              if (mounted) {
                clearAuthData();
                setLoading(false);
              }
              return;
            }
          } else {
            // Token expires in <= 2 minutes: clear so we can try refresh from cookie
            if (mounted) clearAuthData();
          }
        }

        // CASE 2: No token or token invalid, try refresh from httpOnly cookie
        if (pathname === PATHS.ADMIN.LOGIN) {
          if (mounted) clearAuthData();
          return;
        }

        // Check if localStorage has any auth data at all
        const hasAnyAuthData =
          globalThis.window !== undefined &&
          (localStorage.getItem("access-token") || localStorage.getItem("token-expires-at"));

        if (!hasAnyAuthData) {
          if (mounted) clearAuthData();
          return;
        }

        if (refreshing.current || !mounted) return;
        refreshing.current = true;
        setLoading(true);

        try {
          const refreshResponse = await authService.refresh();

          if (refreshResponse.status === "success" && refreshResponse.data && mounted) {
            const { tokens, user: userData } = refreshResponse.data.data;
            setTokenWithExpiry(tokens.access.token, tokens.access.expires_in_seconds);
            setUser(userData);
            scheduleRefresh(tokens.access.expires_in_seconds);
          } else {
            if (mounted) clearAuthData();
          }
        } catch {
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
        refreshTimeout.current = undefined;
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
    const handleStorageChange = (event_: StorageEvent) => {
      if (event_.key === "logout-signal") {
        clearAuthData();
        redirectToLoginIfNeeded();
      }
    };

    if (globalThis.window !== undefined) {
      globalThis.addEventListener("storage", handleStorageChange);
      return () => globalThis.removeEventListener("storage", handleStorageChange);
    }
  }, [clearAuthData, redirectToLoginIfNeeded]);

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

/**
 * React hook to access the authentication context.
 *
 * @throws When used outside of `AuthProvider`
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
