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

/**
 * Authentication provider
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const redirectToLoginIfNeeded = useCallback(() => {
    if (pathname !== PATHS.ADMIN.LOGIN) {
      router.push(PATHS.ADMIN.LOGIN);
    }
  }, [pathname, router]);

  const clearAuthData = useCallback(() => {
    setUser(undefined);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
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

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setLoading(true);
    try {
      await http.post<void>(ENDPOINTS.AUTH.LOGOUT, {}, { throwOnError: false });
    } catch {
      // Ignore errors on logout
    } finally {
      clearAuthData();
      redirectToLoginIfNeeded();
      setLoading(false);
      // Keep isLoggingOut true during redirect to prevent loading screen flash
      // It will reset on next mount/navigation
    }
  }, [clearAuthData, redirectToLoginIfNeeded]);

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

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    if (!isHydrated) return;

    let mounted = true;

    const initSession = async () => {
      setLoading(true);
      setIsLoggingOut(false); // Reset logout flag on mount

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
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
