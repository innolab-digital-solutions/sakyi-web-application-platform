/**
 * Lookup API endpoints
 *
 * Endpoints for fetching lookup data, and reference information.
 * Used for dropdowns, autocomplete, and form options.
 * Requires authentication.
 */
export const LOOKUP_ENDPOINTS = {
  PERMISSIONS: "/lookup/permissions",
  ENROLLMENTS: "/lookup/enrollments",
  ROLES: "/lookup/roles",
  WORKOUT_CATEGORIES: "/lookup/workout-categories",
  FOOD_CATEGORIES: "/lookup/food-categories",
  FOOD_ITEMS: "/lookup/food-items",
  UNITS: "/lookup/units",
  BLOG_CATEGORIES: "/lookup/blog-categories",
  ONBOARDING_FORMS: "/lookup/onboarding-forms",
} as const;
