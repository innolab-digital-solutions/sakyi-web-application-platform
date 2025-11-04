/* eslint-disable no-commented-code/no-commented-code */
import { ADMIN_ENDPOINTS } from "@/config/endpoints/admin";
import { AUTH_ENDPOINTS } from "@/config/endpoints/auth";
import { LOOKUP_ENDPOINTS } from "@/config/endpoints/lookup";
import { PUBLIC_ENDPOINTS } from "@/config/endpoints/public";

/**
 * API endpoint configuration
 *
 * Centralized API endpoint constants organized by domain.
 * Use these constants with the HTTP client instead of hardcoding URLs.
 *
 * Endpoint types:
 * - **AUTH**: Laravel Sanctum authentication endpoints
 * - **ADMIN**: Protected admin resource endpoints
 * - **META**: Metadata and lookup endpoints
 * - **PUBLIC**: Publicly accessible endpoints
 *
 * @example
 * ```ts
 * // Fetch data
 * const response = await http.get(ENDPOINTS.ADMIN.ROLES.INDEX);
 *
 * // With dynamic ID
 * await http.put(ENDPOINTS.ADMIN.ROLES.UPDATE(roleId), data);
 *
 * // Auth endpoints
 * await http.post(ENDPOINTS.AUTH.LOGIN, credentials);
 * ```
 */
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  PUBLIC: PUBLIC_ENDPOINTS,
  LOOKUP: LOOKUP_ENDPOINTS,
} as const;
