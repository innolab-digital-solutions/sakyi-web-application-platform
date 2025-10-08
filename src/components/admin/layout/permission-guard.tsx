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
  const { can } = useAuth();

  React.useEffect(() => {
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
      router.replace(PATHS.ADMIN.OVERVIEW === pathname ? "/" : PATHS.ADMIN.OVERVIEW);
    }
  }, [pathname, router, can]);

  return <>{children}</>;
}
