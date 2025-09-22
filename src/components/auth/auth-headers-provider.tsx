"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getStoredToken } from "@/utils/auth/storage";

export default function AuthHeadersProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const { token, expiresAt, isValid } = getStoredToken();

    if (isValid && token && expiresAt) {
      const maxAge = Math.floor((expiresAt - Date.now()) / 1000);
      document.cookie = `access-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `token-expires-at=${expiresAt}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } else {
      document.cookie = "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "token-expires-at=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [pathname]);

  return;
}
