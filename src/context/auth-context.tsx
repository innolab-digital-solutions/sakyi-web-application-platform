"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { http } from "@/lib/api/client";
import { AuthenticatedResponse, LoginCredentials, User } from "@/types/admin/auth";
import { AuthContextType } from "@/types/admin/auth";
import { Permission } from "@/types/admin/permission";
import { can } from "@/utils/admin/permissions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProperties {
  children: React.ReactNode;
}

/**
 * Authentication provider component
 *
 * Manages user authentication state, session persistence, and provides
 * login/logout functionality with CSRF protection. Handles SSR hydration
 * and prevents flash of unauthenticated content.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider: React.FC<AuthProviderProperties> = ({ children }) => {
  // ============================================================
  // State Management
  // ============================================================

  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // ============================================================
  // Helper Functions
  // ============================================================

  /**
   * Redirects to login page if not already there
   */
  const redirectToLoginIfNeeded = useCallback(() => {
    if (pathname !== PATHS.ADMIN.LOGIN) {
      router.push(PATHS.ADMIN.LOGIN);
    }
  }, [pathname, router]);

  /**
   * Clears all authentication data from state
   */
  const clearAuthData = useCallback(() => {
    setUser(undefined);
  }, []);

  // ============================================================
  // Authentication Methods
  // ============================================================

  /**
   * Authenticates user with credentials
   *
   * Performs CSRF cookie request before login for Laravel Sanctum
   * authentication. Updates user state on success.
   *
   * @param credentials - User login credentials (email/password)
   * @returns Authentication response with user data or error
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      // Fetch CSRF cookie for Laravel Sanctum
      await http.get<void>(ENDPOINTS.AUTH.CSRF_COOKIE, { throwOnError: false });

      const response = await http.post<AuthenticatedResponse>(
        ENDPOINTS.AUTH.LOGIN,
        {
          ...credentials,
        },
        { throwOnError: false },
      );

      if (response.status === "success" && response.data) {
        setUser(response.data.user);
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error occurred";
      return {
        status: "error" as const,
        message: "Network error. Please check your connection.",
        errors: { system: [errorMessage] },
        data: undefined,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logs out current user
   *
   * Makes best-effort server logout request, then clears local state
   * and redirects to login. Maintains logout flag during redirect to
   * prevent loading screen flash.
   */
  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setLoading(true);
    try {
      await http.post<void>(ENDPOINTS.AUTH.LOGOUT, {}, { throwOnError: false });
    } catch {
      // Silently handle logout errors - always clear local state
    } finally {
      clearAuthData();
      redirectToLoginIfNeeded();
      setLoading(false);
    }
  }, [clearAuthData, redirectToLoginIfNeeded]);

  /**
   * Verifies current authentication status
   *
   * Fetches user data from server to validate session. Updates user
   * state on success or clears it on failure.
   *
   * @returns True if authenticated, false otherwise
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await http.get<User>(ENDPOINTS.AUTH.ME, { throwOnError: false });

      if (response.status === "success" && response.data) {
        setUser(response.data);
        return true;
      }

      clearAuthData();
      return false;
    } catch {
      clearAuthData();
      return false;
    }
  }, [clearAuthData]);

  // ============================================================
  // Effects
  // ============================================================

  // Prevent SSR hydration mismatch by marking client-side hydration complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize authentication session on mount
  useEffect(() => {
    if (!isHydrated) return;

    let mounted = true;

    const initSession = async () => {
      setLoading(true);
      setIsLoggingOut(false);

      await checkAuth();

      if (mounted) {
        setLoading(false);
      }
    };

    initSession();

    return () => {
      mounted = false;
    };
  }, [isHydrated, checkAuth]);

  // ============================================================
  // Context Provider
  // ============================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading: loading || !isHydrated,
        isAuthenticated: isHydrated && !!user,
        isLoggingOut,
        can: (permission: string) => can(user?.permissions as Permission, permission),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context
 *
 * Provides access to current user, authentication state, and auth methods.
 * Must be used within an AuthProvider.
 *
 * @returns Authentication context with user state and methods
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
