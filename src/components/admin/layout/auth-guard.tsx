"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";

interface AuthGuardProperties {
  children: React.ReactNode;
  requireAuth?: boolean;
  loginPath?: string;
  dashboardPath?: string;
}

/**
 * Route authentication guard
 */
export default function AuthGuard({
  children,
  requireAuth = true,
  loginPath = PATHS.ADMIN.LOGIN,
  dashboardPath = PATHS.ADMIN.OVERVIEW,
}: AuthGuardProperties) {
  const [isClient, setIsClient] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const { loading: contextLoading, isAuthenticated: contextAuth } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAndRedirect = () => {
      if (pathname === loginPath) {
        if (contextAuth) {
          router.replace(dashboardPath);
        } else {
          setIsChecking(false);
        }
        return;
      }

      if (requireAuth && !contextAuth) {
        router.replace(loginPath);
        return;
      }

      if (!requireAuth) {
        setIsChecking(false);
        return;
      }

      setIsChecking(false);
    };

    if (contextLoading) {
      const timeout = setTimeout(() => {
        checkAndRedirect();
      }, 3000);
      return () => clearTimeout(timeout);
    }

    checkAndRedirect();
  }, [
    isClient,
    contextLoading,
    contextAuth,
    pathname,
    requireAuth,
    loginPath,
    dashboardPath,
    router,
  ]);

  // Show loading screen while performing authentication checks
  if (!isClient || isChecking) {
    // Determine appropriate loading message based on current route
    const isLoginPage = pathname === loginPath;
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="relative">
          <div className="from-primary/10 via-accent/10 absolute -inset-16 animate-pulse rounded-full bg-gradient-to-tr to-blue-300/10 blur-xl" />
          <div className="relative z-10 flex flex-col items-center rounded-2xl border border-white/40 bg-white/80 px-8 py-7 text-center shadow-xl backdrop-blur-xl">
            <div className="relative mb-4">
              <div className="from-primary/20 via-accent/20 absolute inset-0 rounded-full bg-gradient-to-tr to-blue-300/20 blur-lg" />
              <div className="relative rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
                <Spinner className="text-primary size-6" />
              </div>
            </div>

            <h2 className="text-base font-semibold tracking-tight text-gray-800">
              {isLoginPage ? "Redirecting to dashboard" : "Verifying access"}
            </h2>
            <p className="mt-1.5 max-w-xs text-xs text-gray-500">
              {isLoginPage
                ? "You are already signed in. Taking you to the right place."
                : "Please wait while we confirm your session and permissions."}
            </p>

            <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-gray-200">
              <div className="from-primary via-accent h-full w-1/3 animate-[shimmer_1.2s_ease_infinite] rounded-full bg-gradient-to-r to-blue-400" />
            </div>
          </div>
        </div>
        <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(150%);
          }
        }
      `}</style>
      </div>
    );
  }

  // Authentication checks passed, render protected content
  return <>{children}</>;
}
