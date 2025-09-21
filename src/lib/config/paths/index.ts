import { ADMIN_PATHS } from "./admin";
import { PUBLIC_PATHS } from "./public";

/**
 * Paths Configuration
 * Contains all paths that are accessible throughout the application.
 *
 * @returns The paths configuration
 */
export const PATHS = {
  ADMIN: ADMIN_PATHS,
  PUBLIC: PUBLIC_PATHS,
} as const;
