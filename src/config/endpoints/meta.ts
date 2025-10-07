/**
 * Meta API endpoints
 * Protected endpoints requiring authentication
 * This endpoints are used to get the meta data for the application
 *
 * @returns The meta API endpoints
 */
export const META_ENDPOINTS = {
  PERMISSIONS: "/meta/permissions",
  WORKOUT_CATEGORIES: "/meta/workout-categories",
  ROLES: "/meta/roles",
} as const;
