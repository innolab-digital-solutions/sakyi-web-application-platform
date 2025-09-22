import { ADMIN_ENDPOINTS } from "@/config/endpoints/admin";
import { AUTH_ENDPOINTS } from "@/config/endpoints/auth";
import { PUBLIC_ENDPOINTS } from "@/config/endpoints/public";

/**
 * API Endpoints Configuration
 * Contains all API endpoints that are accessible throughout the application.
 *
 * @returns The API endpoints configuration
 */
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  PUBLIC: PUBLIC_ENDPOINTS,
} as const;
