"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { adminNavigation } from "@/config/navigation";
import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";

interface AuthGuardProperties {
  children: React.ReactNode;
  requireAuth?: boolean;
  checkPermissions?: boolean;
  loginPath?: string;
  dashboardPath?: string;
}

type GuardPhase =
  | "hydrating"
  | "auth-checking"
  | "permission-checking"
  | "authenticated"
  | "redirecting";

/**
 * Flatten navigation permissions into a Map
 */
function flattenPermissions() {
  const pathToPermission = new Map<string, string | undefined>();
  for (const group of adminNavigation) {
    for (const item of group.items) {
      pathToPermission.set(item.path, item.permission);
      if (item.subitems) {
        for (const sub of item.subitems) {
          pathToPermission.set(sub.path, sub.permission);
        }
      }
    }
  }
  return pathToPermission;
}

const PATH_PERMISSION_MAP = flattenPermissions();

/**
 * Unified authentication and permission guard
 * Handles both authentication and permission checking with proper loading states
 */
export default function AuthGuard({
  children,
  requireAuth = true,
  checkPermissions = true,
  loginPath = PATHS.ADMIN.LOGIN,
  dashboardPath = PATHS.ADMIN.OVERVIEW,
}: AuthGuardProperties) {
  const [phase, setPhase] = useState<GuardPhase>("hydrating");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { loading: contextLoading, isAuthenticated, user, can } = useAuth();

  // Phase 1: Wait for client-side hydration
  useEffect(() => {
    setIsMounted(true);
    setPhase("hydrating");
    const timer = setTimeout(() => {
      setPhase("auth-checking");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Phase 2 & 3: Authentication and Permission checking
  useEffect(() => {
    if (phase === "hydrating") return;

    const runChecks = async () => {
      // Wait for auth context to finish loading first
      if (contextLoading) {
        setPhase("auth-checking");
        return;
      }

      // Special case: Login page - block authenticated users
      if (pathname === loginPath) {
        if (isAuthenticated) {
          // Authenticated user trying to access login page - redirect to dashboard
          setPhase("redirecting");
          router.replace(dashboardPath);
        } else {
          // Unauthenticated user on login page - allow access
          setPhase("authenticated");
        }
        return;
      }

      // For all other routes, check authentication first
      if (requireAuth && !isAuthenticated) {
        // Unauthenticated user trying to access protected route - redirect to login
        setPhase("redirecting");
        router.replace(loginPath);
        return;
      }

      // If no auth required or not checking permissions, proceed
      if (!requireAuth || !checkPermissions) {
        setPhase("authenticated");
        return;
      }

      // Phase 3: Permission checking (only for authenticated protected routes)
      setPhase("permission-checking");

      // Small delay to show permission checking state
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (!user) {
        // User data not loaded yet - should not happen but safety check
        setPhase("redirecting");
        router.replace(loginPath);
        return;
      }

      // Check if route requires specific permission
      let requiredPermission: string | undefined;
      let matched = false;

      // Exact match first
      if (PATH_PERMISSION_MAP.has(pathname)) {
        requiredPermission = PATH_PERMISSION_MAP.get(pathname);
        matched = true;
      } else {
        // If no exact match, try prefix match for nested routes
        for (const [path, permission] of PATH_PERMISSION_MAP.entries()) {
          if (pathname.startsWith(path + "/")) {
            requiredPermission = permission;
            matched = true;
            break;
          }
        }
      }

      // If route not in navigation, allow access (unlisted routes)
      if (!matched) {
        setPhase("authenticated");
        return;
      }

      // If permission is empty string, treat as restricted (hidden + blocked)
      if (requiredPermission !== undefined && requiredPermission.trim().length === 0) {
        setPermissionDenied(true);
        setPhase("redirecting");
        const redirectTo = pathname === dashboardPath ? PATHS.PUBLIC.HOME : dashboardPath;
        setTimeout(() => router.replace(redirectTo), 1500);
        return;
      }

      // If permission is required and user doesn't have it
      if (
        typeof requiredPermission === "string" &&
        requiredPermission.trim().length > 0 &&
        !can(requiredPermission)
      ) {
        setPermissionDenied(true);
        setPhase("redirecting");
        const redirectTo = pathname === dashboardPath ? PATHS.PUBLIC.HOME : dashboardPath;
        setTimeout(() => router.replace(redirectTo), 1500);
        return;
      }

      // All checks passed
      setPhase("authenticated");
      setPermissionDenied(false);
    };

    runChecks();
  }, [
    phase,
    pathname,
    contextLoading,
    isAuthenticated,
    user,
    can,
    requireAuth,
    checkPermissions,
    loginPath,
    dashboardPath,
    router,
  ]);

  // Prevent hydration mismatch - don't render anything until mounted
  if (!isMounted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="relative">
          <div className="from-primary/10 via-accent/10 absolute -inset-16 animate-pulse rounded-full bg-gradient-to-tr to-blue-300/10 blur-xl" />
          <div className="relative z-10 flex h-52 w-80 flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/80 px-8 py-7 text-center shadow-xl backdrop-blur-xl">
            <div className="relative mb-4">
              <div className="from-primary/20 via-accent/20 absolute inset-0 rounded-full bg-gradient-to-tr to-blue-300/20 blur-lg" />
              <div className="relative rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
                <Spinner className="text-primary size-6" />
              </div>
            </div>
            <h2 className="text-base font-semibold tracking-tight text-gray-800">Initializing</h2>
            <p className="mt-1.5 max-w-xs text-xs text-gray-500">Preparing your workspace...</p>
            <div className="mt-5 h-1 w-40">
              <div className="h-full w-full overflow-hidden rounded-full bg-gray-200">
                <div className="from-primary via-accent h-full w-1/3 animate-[shimmer_1.2s_ease_infinite] rounded-full bg-gradient-to-r to-blue-400" />
              </div>
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

  // Show loading screens based on phase
  if (phase !== "authenticated") {
    const isLoginPage = pathname === loginPath;

    let title = "Loading";
    let description = "Please wait...";
    let showDenied = false;

    switch (phase) {
      case "hydrating": {
        title = "Initializing";
        description = "Preparing your workspace...";
        break;
      }
      case "auth-checking": {
        title = isLoginPage ? "Checking session" : "Verifying authentication";
        description = isLoginPage
          ? "Checking if you're already signed in..."
          : "Please wait while we confirm your session...";
        break;
      }
      case "permission-checking": {
        title = "Checking permissions";
        description = "Verifying your access rights for this page...";
        break;
      }
      case "redirecting": {
        if (permissionDenied) {
          title = "Access Denied";
          description = "You don't have permission to access this page. Redirecting...";
          showDenied = true;
        } else if (isLoginPage) {
          title = "Redirecting to dashboard";
          description = "You are already signed in. Taking you to the right place.";
        } else {
          title = "Redirecting";
          description = "Taking you to the right place...";
        }
        break;
      }
    }

    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="relative">
          <div
            className={`from-primary/10 via-accent/10 absolute -inset-16 animate-pulse rounded-full bg-gradient-to-tr to-blue-300/10 blur-xl ${
              showDenied ? "from-red-500/10 via-orange-500/10 to-red-300/10" : ""
            }`}
          />
          <div className="relative z-10 flex h-52 w-80 flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/80 px-8 py-7 text-center shadow-xl backdrop-blur-xl">
            <div className="relative mb-4">
              <div
                className={`from-primary/20 via-accent/20 absolute inset-0 rounded-full bg-gradient-to-tr to-blue-300/20 blur-lg ${
                  showDenied ? "from-red-500/20 via-orange-500/20 to-red-300/20" : ""
                }`}
              />
              <div className="relative rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
                {showDenied ? (
                  <svg
                    className="size-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <Spinner className="text-primary size-6" />
                )}
              </div>
            </div>

            <h2
              className={`text-base font-semibold tracking-tight ${
                showDenied ? "text-red-700" : "text-gray-800"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mt-1.5 max-w-xs text-xs ${showDenied ? "text-red-600" : "text-gray-500"}`}
            >
              {description}
            </p>

            <div className="mt-5 h-1 w-40">
              {!showDenied && (
                <div className="h-full w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="from-primary via-accent h-full w-1/3 animate-[shimmer_1.2s_ease_infinite] rounded-full bg-gradient-to-r to-blue-400" />
                </div>
              )}
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

  // All checks passed, render protected content
  return <>{children}</>;
}
