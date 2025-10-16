/* eslint-disable no-commented-code/no-commented-code */
import { ADMIN_PATHS } from "@/config/paths/admin";
import { PUBLIC_PATHS } from "@/config/paths/public";

/**
 * Application route paths configuration
 *
 * Centralized route path constants organized by domain (admin, public).
 * Use these constants instead of hardcoding paths for:
 * - Navigation and routing
 * - Redirects and guards
 * - Link components
 *
 * @example
 * ```tsx
 * // Navigation
 * router.push(PATHS.ADMIN.OVERVIEW);
 *
 * // Dynamic routes
 * const editPath = PATHS.ADMIN.ROLES.EDIT(roleId);
 *
 * // Links
 * <Link href={PATHS.PUBLIC.HOME}>Home</Link>
 * ```
 */
export const PATHS = {
  ADMIN: ADMIN_PATHS,
  PUBLIC: PUBLIC_PATHS,
} as const;
