"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { adminNavigation } from "@/config/navigation";
import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";

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

export default function PermissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { can, loading, isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    // Don't run permission checks while auth is still loading
    if (loading) return;

    // Don't run permission checks if not authenticated (let auth context handle redirect)
    if (!isAuthenticated) return;

    // Don't run permission checks if user data is not loaded yet
    if (!user) return;

    if (!pathname) return;

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

    if (!matched) {
      return; // route not listed → allow
    }

    // If permission is explicitly an empty string, treat as restricted (hidden + blocked)
    if (requiredPermission !== undefined && requiredPermission.trim().length === 0) {
      router.replace(PATHS.ADMIN.OVERVIEW === pathname ? "/" : PATHS.ADMIN.OVERVIEW);
      return;
    }

    // If permission is a non-empty string, enforce can()
    if (
      typeof requiredPermission === "string" &&
      requiredPermission.trim().length > 0 &&
      !can(requiredPermission)
    ) {
      router.replace(PATHS.ADMIN.OVERVIEW === pathname ? PATHS.PUBLIC.HOME : PATHS.ADMIN.OVERVIEW);
    }
  }, [pathname, router, can, loading, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-2 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
