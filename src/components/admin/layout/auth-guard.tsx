"use client";

import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [isMounted, setIsMounted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState("");

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
      // Special case: Login page - handle authentication check
      if (pathname === loginPath) {
        if (contextLoading) {
          // Still checking authentication, keep showing loading
          setPhase("auth-checking");
          return;
        }

        if (isAuthenticated) {
          // User is authenticated, redirect to dashboard
          setPhase("redirecting");
          router.replace(dashboardPath);
        } else {
          // User is not authenticated, show login form
          setPhase("authenticated");
        }
        return;
      }

      // For all other routes, wait for context to finish loading
      if (contextLoading) {
        setPhase("auth-checking");
        return;
      }

      if (requireAuth && !isAuthenticated) {
        setPhase("redirecting");
        router.replace(loginPath);
        return;
      }

      if (!requireAuth || !checkPermissions) {
        setPhase("authenticated");
        return;
      }

      setPhase("permission-checking");

      if (!user) {
        setPhase("redirecting");
        router.replace(loginPath);
        return;
      }

      if (pathname === dashboardPath) {
        setPhase("authenticated");
        return;
      }

      // Check if route requires specific permission
      let requiredPermission: string | undefined;
      let matched = false;

      if (PATH_PERMISSION_MAP.has(pathname)) {
        requiredPermission = PATH_PERMISSION_MAP.get(pathname);
        matched = true;
      } else {
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

      // If permission is empty or undefined, treat as misconfigured (deny access)
      if (!requiredPermission || requiredPermission.trim().length === 0) {
        setPermissionDenied(true);
        setDeniedMessage("This page is misconfigured and cannot be accessed at this time.");
        return;
      }

      if (!can(requiredPermission)) {
        setPermissionDenied(true);
        setDeniedMessage(
          // Just present a single message like the 404 page in not-found.tsx
          "You do not have permission to view this page.",
        );
        return;
      }

      setPhase("authenticated");
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

  // Show 403 permission denied page
  if (permissionDenied) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl text-center">
          {/* Hero Image */}
          <div className="mb-12 flex justify-center">
            <Image
              src="/images/403.png"
              alt="Access denied"
              width={400}
              height={300}
              priority
              className="h-auto w-full max-w-md"
            />
          </div>
          <div className="space-y-6">
            {/* Error Badge & Title */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-none px-2 py-1.5 font-semibold"
                >
                  403 Forbidden
                </Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-4xl">
                Access Denied
              </h1>
              <p className="text-md text-muted-foreground mx-auto max-w-2xl font-semibold">
                {deniedMessage}
              </p>
            </div>
            {/* Actions */}
            <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
              <Button
                asChild
                className="from-primary to-accent hover:from-primary/90 hover:to-accent/90 group relative flex h-10 min-w-[140px] items-center justify-center gap-2 overflow-hidden bg-gradient-to-r text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <Link href={PATHS.ADMIN.OVERVIEW}>
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/10 to-white/5 transition-transform duration-700 ease-out group-hover:translate-x-[100%]" />
                  <Home />
                  <span className="relative">Go Back To Dashboard</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const isLoginPage = pathname === loginPath;

  // Special case for login page with authenticated users:
  // Always show loading screen until redirect completes (never show login form)
  if (isLoginPage && isAuthenticated && phase !== "authenticated") {
    const title = phase === "redirecting" ? "Redirecting to dashboard" : "Checking session";
    const description =
      phase === "redirecting"
        ? "You are already signed in. Taking you to the dashboard..."
        : "Checking if you're already signed in...";

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

            <h2 className="text-base font-semibold tracking-tight text-gray-800">{title}</h2>
            <p className="mt-1.5 max-w-xs text-xs text-gray-500">{description}</p>

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
    // Special case: On login page, skip loading screen only for unauthenticated users during auth checks
    // This allows the login form to appear immediately for users who need to log in
    // BUT: Only skip if contextLoading is done (to avoid flashing login form while checking)
    if (isLoginPage && !isAuthenticated && !contextLoading && phase === "auth-checking") {
      return <>{children}</>;
    }

    let title = "Loading";
    let description = "Please wait...";

    switch (phase) {
      case "hydrating": {
        title = "Initializing";
        description = "Preparing your workspace...";
        break;
      }
      case "auth-checking": {
        title = "Verifying authentication";
        description = "Please wait while we confirm your session...";
        break;
      }
      case "permission-checking": {
        title = "Checking permissions";
        description = "Verifying your access rights for this page...";
        break;
      }
      case "redirecting": {
        title = "Redirecting";
        description = "Taking you to the right place...";
        break;
      }
    }

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

            <h2 className="text-base font-semibold tracking-tight text-gray-800">{title}</h2>
            <p className="mt-1.5 max-w-xs text-xs text-gray-500">{description}</p>

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

  // All checks passed, render protected content
  return <>{children}</>;
}
