/**
 * Metadata API endpoints
 *
 * Endpoints for fetching metadata, lookup data, and reference information.
 * Used for dropdowns, autocomplete, and form options.
 * Requires authentication.
 */
export const META_ENDPOINTS = {
  /** Available permissions list */
  PERMISSIONS: "/meta/permissions",

  /** Workout categories for dropdowns */
  WORKOUT_CATEGORIES: "/meta/workout-categories",

  WORKOUT_EQUIPMENTS: "/meta/workout-equipments",

  WORKOUTS: "/meta/workouts",

  /** Food categories for dropdowns */
  FOOD_CATEGORIES: "/meta/food-categories",
} as const;
