import { ADMIN_ENDPOINTS } from "./admin";
import { AUTH_ENDPOINTS } from "./auth";
import { PUBLIC_ENDPOINTS } from "./public";

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
