"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getStoredToken } from "@/lib/auth-utils";

/**
 * Component that provides authentication data to the middleware via cookies
 * This allows the middleware to check authentication status on the server
 */
export default function AuthHeadersProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client-side
    if (globalThis.window === undefined) return;

    // Get stored token
    const { token, expiresAt, isValid } = getStoredToken();

    if (isValid && token && expiresAt) {
      // Set cookies that middleware can read
      document.cookie = `access-token=${token}; path=/; max-age=${Math.floor((expiresAt - Date.now()) / 1000)}; SameSite=Lax`;
      document.cookie = `token-expires-at=${expiresAt}; path=/; max-age=${Math.floor((expiresAt - Date.now()) / 1000)}; SameSite=Lax`;
    } else {
      // Clear auth cookies
      document.cookie = "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "token-expires-at=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
