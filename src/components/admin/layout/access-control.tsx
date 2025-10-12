"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ErrorPage } from "@/components/shared/error-page";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { adminNavigation } from "@/config/navigation";
import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";

interface AccessControlProperties {
  children: React.ReactNode;
  requireAuth?: boolean;
  checkPermissions?: boolean;
  loginPath?: string;
  dashboardPath?: string;
}

type AccessPhase =
  | "hydrating"
  | "auth-checking"
  | "permission-checking"
  | "authenticated"
  | "redirecting";

/**
 * Build a map of route paths to their required permissions
 */
function buildPermissionMap() {
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

const PERMISSION_MAP = buildPermissionMap();

/**
 * Get the required permission for a given route path
 */
function getRequiredPermission(pathname: string): {
  permission: string | undefined;
  isMatched: boolean;
} {
  // Direct match
  if (PERMISSION_MAP.has(pathname)) {
    return {
      permission: PERMISSION_MAP.get(pathname),
      isMatched: true,
    };
  }

  // Check if path starts with any registered route
  for (const [path, permission] of PERMISSION_MAP.entries()) {
    if (pathname.startsWith(path + "/")) {
      return { permission, isMatched: true };
    }
  }

  // Route not in navigation (unlisted route)
  return { permission: undefined, isMatched: false };
}

/**
 * Determine loading screen content based on current phase
 */
function getLoadingContent(phase: AccessPhase, isLoginPage: boolean, isAuthenticated: boolean) {
  if (isLoginPage && isAuthenticated) {
    return {
      title: phase === "redirecting" ? "Redirecting to dashboard" : "Checking session",
      description:
        phase === "redirecting"
          ? "You are already signed in. Taking you to the dashboard..."
          : "Checking if you're already signed in...",
    };
  }

  switch (phase) {
    case "hydrating": {
      return {
        title: "Initializing",
        description: "Preparing your workspace...",
      };
    }
    case "auth-checking": {
      return {
        title: "Verifying authentication",
        description: "Please wait while we confirm your session...",
      };
    }
    case "permission-checking": {
      return {
        title: "Checking permissions",
        description: "Verifying your access rights for this page...",
      };
    }
    case "redirecting": {
      return {
        title: "Redirecting",
        description: "Taking you to the right place...",
      };
    }
    default: {
      return {
        title: "Loading",
        description: "Please wait...",
      };
    }
  }
}

/**
 * Access Control Component (formerly AuthGuard)
 *
 * Manages authentication and authorization for protected routes:
 * - Handles SSR hydration without mismatches
 * - Verifies user authentication
 * - Checks route-specific permissions
 * - Provides appropriate loading states
 * - Shows error pages for permission denials
 * - Skips loading screens during logout
 */
export default function AccessControl({
  children,
  requireAuth = true,
  checkPermissions = true,
  loginPath = PATHS.ADMIN.LOGIN,
  dashboardPath = PATHS.ADMIN.OVERVIEW,
}: AccessControlProperties) {
  const [phase, setPhase] = useState<AccessPhase>("hydrating");
  const [isMounted, setIsMounted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState("");
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { loading: contextLoading, isAuthenticated, isLoggingOut, user, can } = useAuth();

  const isLoginPage = pathname === loginPath;

  // Phase 1: Client-side hydration
  useEffect(() => {
    setIsMounted(true);
    setPhase("hydrating");

    const timer = setTimeout(() => {
      setPhase("auth-checking");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Phase 2 & 3: Authentication and permission validation
  useEffect(() => {
    if (phase === "hydrating") return;

    const validateAccess = async () => {
      // Login page: redirect authenticated users to dashboard
      if (isLoginPage) {
        if (contextLoading) {
          setPhase("auth-checking");
          return;
        }

        // Mark that initial auth check is complete
        setInitialAuthCheckDone(true);

        if (isAuthenticated) {
          setPhase("redirecting");
          router.replace(dashboardPath);
        } else {
          setPhase("authenticated");
        }
        return;
      }

      // Wait for auth context to finish loading
      if (contextLoading) {
        setPhase("auth-checking");
        return;
      }

      // Check authentication requirement
      if (requireAuth && !isAuthenticated) {
        setPhase("redirecting");
        router.replace(loginPath);
        return;
      }

      // Skip permission checks if not required
      if (!requireAuth || !checkPermissions) {
        setPhase("authenticated");
        return;
      }

      // Verify user is loaded
      if (!user) {
        setPhase("redirecting");
        router.replace(loginPath);
        return;
      }

      // Dashboard route always accessible
      if (pathname === dashboardPath) {
        setPhase("authenticated");
        return;
      }

      // Check route permission requirements
      setPhase("permission-checking");

      const { permission: requiredPermission, isMatched } = getRequiredPermission(pathname);

      // Unlisted routes are accessible by default
      if (!isMatched) {
        setPhase("authenticated");
        return;
      }

      // Misconfigured routes (empty permission) are denied
      if (!requiredPermission || requiredPermission.trim().length === 0) {
        setPermissionDenied(true);
        setDeniedMessage("This page is misconfigured and cannot be accessed at this time.");
        return;
      }

      // Check user permission
      if (!can(requiredPermission)) {
        setPermissionDenied(true);
        setDeniedMessage("You do not have permission to view this page.");
        return;
      }

      setPhase("authenticated");
    };

    validateAccess();
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
    isLoginPage,
    router,
  ]);

  // Permission denied: show 403 error page
  if (permissionDenied) {
    return (
      <ErrorPage
        code="403 Forbidden"
        imageSrc="/images/403.png"
        imageAlt="Access denied"
        title="Access Denied"
        description={deniedMessage}
        actions={[
          {
            label: "Go Back To Dashboard",
            href: PATHS.ADMIN.OVERVIEW,
            icon: ArrowLeft,
            variant: "default",
          },
        ]}
      />
    );
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return <LoadingScreen title="Initializing" description="Preparing your workspace..." />;
  }

  // Special case for login page with authenticated users:
  // Always show loading screen until redirect completes (never show login form)
  if (isLoginPage && isAuthenticated && phase !== "authenticated") {
    const { title, description } = getLoadingContent(phase, isLoginPage, isAuthenticated);
    return <LoadingScreen title={title} description={description} />;
  }

  // Skip all loading screens during logout - user already sees logout animation
  if (isLoggingOut) {
    return <>{children}</>;
  }

  // Show loading screens based on phase
  if (phase !== "authenticated") {
    // Special case: On login page, show login form after initial auth check is done
    // This prevents showing the form to authenticated users before redirect
    // But keeps the form visible during form submission (when contextLoading becomes true again)
    if (isLoginPage && !isAuthenticated && initialAuthCheckDone) {
      return <>{children}</>;
    }

    const { title, description } = getLoadingContent(phase, isLoginPage, isAuthenticated);
    return <LoadingScreen title={title} description={description} />;
  }

  // All checks passed: render protected content
  return <>{children}</>;
}
