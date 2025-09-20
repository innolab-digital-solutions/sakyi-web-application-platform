"use client";

import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { AUTH } from "@/config/endpoints";
import { ADMIN } from "@/config/routes";
import { LoginFormData } from "@/features/auth/validations/login-schema";
import { http } from "@/lib/fetcher";
import { Token, User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    data: LoginFormData,
  ) => Promise<{ status: string; message?: string; errors?: unknown; data?: unknown }>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
  handleApiError: (error: unknown) => Promise<string | null>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Secure Token Storage ----
const STORAGE_KEY = "access-token";
const EXPIRY_KEY = "token-expires-at";

// Simple encryption for added security (you can use crypto-js for stronger encryption)
const encryptToken = (token: string): string => {
  if (globalThis.window === undefined) return token;
  // Use a static salt to prevent hydration mismatches
  return btoa(token + "_sakyi_salt_v1");
};

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

// Storage helpers
const getStoredToken = (): { token: string | null; expiresAt: number | null } => {
  if (globalThis.window === undefined) {
    console.log("🔍 SSR: Window undefined, returning null token");
    return { token: null, expiresAt: null };
  }

  try {
    const encryptedToken = localStorage.getItem(STORAGE_KEY);
    const storedExpiry = localStorage.getItem(EXPIRY_KEY);

    console.log("🔍 Storage check:", {
      hasToken: !!encryptedToken,
      hasExpiry: !!storedExpiry,
      tokenLength: encryptedToken?.length || 0,
    });

    if (!encryptedToken || !storedExpiry) {
      console.log("❌ No token in storage");
      return { token: null, expiresAt: null };
    }

    const expiresAt = Number.parseInt(storedExpiry, 10);
    const now = Date.now();
    const timeLeft = expiresAt - now;

    console.log("⏰ Token expiry check:", {
      expiresAt: new Date(expiresAt).toLocaleTimeString(),
      timeLeftMinutes: Math.round(timeLeft / 60_000),
      isExpired: timeLeft <= 0,
    });

    // Check if token is expired
    if (timeLeft <= 0) {
      console.log("🕐 Stored token expired, clearing...");
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      return { token: null, expiresAt: null };
    }

    const token = decryptToken(encryptedToken);
    console.log("🔓 Token retrieved:", {
      success: !!token,
      tokenLength: token?.length || 0,
    });

    return { token, expiresAt };
  } catch (error) {
    console.error("❌ Storage retrieval error:", error);
    // Clear corrupted storage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return { token: null, expiresAt: null };
  }
};

const setStoredToken = (token: string | null, expiresAt: number | null): void => {
  if (globalThis.window === undefined) {
    console.log("🔍 SSR: Window undefined, cannot store token");
    return;
  }

  try {
    if (token && expiresAt) {
      const encryptedToken = encryptToken(token);
      localStorage.setItem(STORAGE_KEY, encryptedToken);
      localStorage.setItem(EXPIRY_KEY, expiresAt.toString());

      // Verify storage worked
      const verification = localStorage.getItem(STORAGE_KEY);
      console.log("🔐 Token storage:", {
        tokenLength: token.length,
        encryptedLength: encryptedToken.length,
        expiresAt: new Date(expiresAt).toLocaleTimeString(),
        verified: !!verification,
        verificationLength: verification?.length || 0,
      });
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      console.log("🗑️ Token removed from storage");
    }
  } catch (error) {
    console.error("❌ Storage write error:", error);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state as null to prevent hydration mismatches
  // We'll load from storage in useEffect after hydration
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const refreshing = useRef(false);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const lastRefreshTime = useRef<number>(0);
  const refreshCooldown = 30_000; // 30 seconds cooldown between refreshes

  // ---- Helpers ----
  const clearAuthData = useCallback(() => {
    setToken(null);
    setUser(null);
    setTokenExpiresAt(null);
    retryCount.current = 0;
    lastRefreshTime.current = 0;

    // Clear from storage
    setStoredToken(null, null);

    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
      refreshTimeout.current = null;
    }
  }, []);

  // ---- Token Management ----
  const setTokenWithExpiry = useCallback((newToken: string, expiresInSeconds: number) => {
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    // Update state
    setToken(newToken);
    setTokenExpiresAt(expiresAt);

    // Persist to storage
    setStoredToken(newToken, expiresAt);

    console.log(`🎫 Token set and stored, expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
  }, []);

  // ---- Check if token needs refresh ----
  const isTokenExpiringSoon = useCallback(
    (bufferMinutes: number = 2): boolean => {
      if (!tokenExpiresAt) return true;
      const bufferMs = bufferMinutes * 60 * 1000;
      return Date.now() >= tokenExpiresAt - bufferMs;
    },
    [tokenExpiresAt],
  );

  // ---- Check if token is completely expired ----
  const isTokenExpired = useCallback((): boolean => {
    if (!tokenExpiresAt) return true;
    return Date.now() >= tokenExpiresAt;
  }, [tokenExpiresAt]);

  // Export these for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _tokenHelpers = { isTokenExpiringSoon, isTokenExpired };

  // ---- Refresh Token ----
  const refresh = useCallback(async (): Promise<string | null> => {
    if (refreshing.current) return null;
    refreshing.current = true;
    setLoading(true);

    try {
      console.log("🔄 Attempting token refresh...");

      const res = await http.post<{ tokens: Token; user: User }>(
        AUTH.REFRESH,
        {},
        { requireAuth: false },
      );

      if (res.status === "success" && res.data) {
        console.log(
          "✅ Token refreshed successfully, expires in:",
          res.data.tokens.access.expires_in_seconds,
          "seconds",
        );

        setTokenWithExpiry(res.data.tokens.access.token, res.data.tokens.access.expires_in_seconds);
        setUser(res.data.user);
        retryCount.current = 0;

        // Schedule next refresh - 2 minutes before expiry
        const refreshDelay = Math.max(
          (res.data.tokens.access.expires_in_seconds - 120) * 1000,
          30_000,
        );
        console.log(`⏰ Next refresh scheduled in ${refreshDelay / 1000} seconds`);

        if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
        refreshTimeout.current = setTimeout(() => {
          console.log("⏰ Auto-refresh timer triggered");
          refresh();
        }, refreshDelay);

        return res.data.tokens.access.token;
      } else {
        console.error("❌ Refresh failed:", res.message);
        throw new Error(res.message || "Token refresh failed");
      }
    } catch (error: unknown) {
      console.error("❌ Refresh error:", error);

      retryCount.current++;
      if (retryCount.current >= maxRetries) {
        console.error("❌ Max retries exceeded, clearing auth data");
        clearAuthData();
        if (pathname !== AUTH.LOGIN) router.push(AUTH.LOGIN);
      } else {
        // Retry with exponential backoff
        const retryDelay = Math.min(5000 * retryCount.current, 30_000);
        console.log(
          `🔄 Retrying in ${retryDelay / 1000}s (attempt ${retryCount.current}/${maxRetries})`,
        );

        setTimeout(() => {
          refresh();
        }, retryDelay);
      }
      return null;
    } finally {
      refreshing.current = false;
      setLoading(false);
    }
  }, [clearAuthData, router, pathname, setTokenWithExpiry]);

  // ---- Smart Refresh (only when needed) ----
  const smartRefresh = useCallback(async (): Promise<string | null> => {
    const now = Date.now();

    // Check cooldown to prevent excessive refreshes
    if (now - lastRefreshTime.current < refreshCooldown) {
      console.log("🔄 Refresh cooldown active, skipping...");
      return token; // Return current token if in cooldown
    }

    lastRefreshTime.current = now;
    return await refresh();
  }, [token, refresh]);

  // ---- Global API Error Handler (for 401s) ----
  const handleApiError = useCallback(
    async (error: unknown) => {
      const errorObject = error as { status?: number; response?: { status?: number } };
      if (errorObject?.status === 401 || errorObject?.response?.status === 401) {
        console.log("🔒 401 detected, attempting smart refresh...");
        setLoading(true);
        try {
          return await smartRefresh();
        } finally {
          setLoading(false);
        }
      }
      return null;
    },
    [smartRefresh],
  );

  // ---- Login ----
  const login = useCallback(
    async (payload: LoginFormData) => {
      setLoading(true);
      try {
        console.log("🔐 Attempting login...");

        const res = await http.post<{ tokens: Token; user: User }>(AUTH.LOGIN, payload, {
          requireAuth: false,
        });

        if (res.status === "success" && res.data) {
          console.log(
            "✅ Login successful, expires in:",
            res.data.tokens.access.expires_in_seconds,
            "seconds",
          );

          setTokenWithExpiry(
            res.data.tokens.access.token,
            res.data.tokens.access.expires_in_seconds,
          );
          setUser(res.data.user);
          retryCount.current = 0;

          // Schedule first refresh - 2 minutes before expiry
          const refreshDelay = Math.max(
            (res.data.tokens.access.expires_in_seconds - 120) * 1000,
            30_000,
          );
          console.log(`⏰ First refresh scheduled in ${refreshDelay / 1000} seconds`);

          if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
          refreshTimeout.current = setTimeout(() => {
            console.log("⏰ Auto-refresh timer triggered after login");
            refresh();
          }, refreshDelay);

          // Return success response for validation-friendly usage
          return res;
        } else {
          // Return error response instead of throwing
          return res;
        }
      } catch (error) {
        // Return network error in proper format
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
    [refresh, setTokenWithExpiry],
  );

  // ---- Logout ----
  const logout = useCallback(async () => {
    console.log("🚪 Logging out...");
    setLoading(true);
    try {
      if (token) {
        await http.post(AUTH.LOGOUT, {}, { requireAuth: true, token });
      }
    } catch (error) {
      console.warn("⚠️ Logout request failed:", error);
    } finally {
      clearAuthData();

      // Signal cross-tab logout
      if (globalThis.window !== undefined) {
        localStorage.setItem("logout-signal", Date.now().toString());
        localStorage.removeItem("logout-signal");
      }

      if (pathname !== ADMIN.LOGIN) router.push(ADMIN.LOGIN);
      setLoading(false);
    }
  }, [token, router, clearAuthData, pathname]);

  // ---- Hydration Effect ----
  useEffect(() => {
    // Set hydrated flag and load initial token from storage
    setIsHydrated(true);

    const stored = getStoredToken();
    if (stored.token && stored.expiresAt) {
      setToken(stored.token);
      setTokenExpiresAt(stored.expiresAt);
    }
  }, []);

  // ---- Session Init ----
  useEffect(() => {
    // Don't run until hydrated
    if (!isHydrated) return;

    let mounted = true;

    const initSession = async () => {
      // Prevent multiple initialization calls
      if (refreshing.current || !mounted) return;

      console.log("🚀 Initializing session...");

      try {
        // CASE 1: We have a valid stored token
        if (token && tokenExpiresAt) {
          const timeUntilExpiry = tokenExpiresAt - Date.now();

          if (timeUntilExpiry > 120_000) {
            // More than 2 minutes left
            console.log(
              `🎫 Token valid for ${Math.round(timeUntilExpiry / 60_000)} minutes, validating...`,
            );

            // If we already have user data, skip the /me call
            if (user) {
              console.log("✅ User data already available, skipping /me call");

              // Schedule refresh 2 minutes before expiry
              const refreshDelay = Math.max(timeUntilExpiry - 120_000, 30_000);
              refreshTimeout.current = setTimeout(() => {
                if (mounted) refresh();
              }, refreshDelay);

              setLoading(false);
              return;
            }

            try {
              setLoading(true);
              const meRes = await http.get<User>(AUTH.ME, { requireAuth: true, token });

              if (meRes.status === "success" && meRes.data && mounted) {
                console.log("✅ Token validation successful");
                setUser(meRes.data);

                // Schedule refresh 2 minutes before expiry
                const refreshDelay = Math.max(timeUntilExpiry - 120_000, 30_000);
                refreshTimeout.current = setTimeout(() => {
                  if (mounted) refresh();
                }, refreshDelay);

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
        // Skip refresh attempt if we're on login page or if localStorage is completely empty
        if (pathname === ADMIN.LOGIN) {
          console.log("🚫 On login page, skipping refresh attempt");
          if (mounted) clearAuthData();
          return;
        }

        // Check if localStorage has any auth data at all
        const hasAnyAuthData =
          globalThis.window !== undefined &&
          (localStorage.getItem(STORAGE_KEY) || localStorage.getItem(EXPIRY_KEY));

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
          const refreshRes = await http.post<{ tokens: Token; user: User }>(
            AUTH.REFRESH,
            {},
            { requireAuth: false },
          );

          if (refreshRes.status === "success" && refreshRes.data && mounted) {
            console.log("✅ Session restored via refresh");

            setTokenWithExpiry(
              refreshRes.data.tokens.access.token,
              refreshRes.data.tokens.access.expires_in_seconds,
            );
            setUser(refreshRes.data.user);

            // Schedule next refresh
            const refreshDelay = Math.max(
              (refreshRes.data.tokens.access.expires_in_seconds - 120) * 1000,
              30_000,
            );
            refreshTimeout.current = setTimeout(() => {
              if (mounted) refresh();
            }, refreshDelay);
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
    refresh,
    pathname,
  ]);

  // ---- Cross-tab Logout Sync ----
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "logout-signal") {
        console.log("🔄 Cross-tab logout detected");
        clearAuthData();
        if (pathname !== AUTH.LOGIN) router.push(AUTH.LOGIN);
      }
    };

    if (globalThis.window !== undefined) {
      globalThis.addEventListener("storage", handleStorageChange);
      return () => globalThis.removeEventListener("storage", handleStorageChange);
    }
  }, [router, clearAuthData, pathname]);

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
