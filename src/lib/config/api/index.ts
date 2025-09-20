import { ADMIN_API } from "./admin";
import { AUTH_API } from "./auth";
import { PUBLIC_API } from "./public";

/**
 * API Endpoints Configuration
 *
 * Contains all API endpoints that are accessible throughout the application.
 */
export const API = {
  AUTH: AUTH_API,
  ADMIN: ADMIN_API,
  PUBLIC: PUBLIC_API,
} as const;
