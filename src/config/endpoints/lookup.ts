/**
 * Lookup API endpoints
 *
 * Endpoints for fetching lookup data, and reference information.
 * Used for dropdowns, autocomplete, and form options.
 * Requires authentication.
 */
export const LOOKUP_ENDPOINTS = {
  /** Available permissions list */
  PERMISSIONS: "/lookup/permissions",

  /** Workout categories for dropdowns */
  WORKOUT_CATEGORIES: "/lookup/workout-categories",

  /** Food categories for dropdowns */
  FOOD_CATEGORIES: "/lookup/food-categories",
  FOOD_ITEMS: "/lookup/food-items",
  UNITS: "/lookup/units",
} as const;
