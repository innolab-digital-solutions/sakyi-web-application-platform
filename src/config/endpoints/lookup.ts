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
  USERS: "/lookup/users",
  TEAM_MEMBERS: "/lookup/members",
  WORKOUT_CATEGORIES: "/lookup/workout-categories",
  FOOD_CATEGORIES: "/lookup/food-categories",
  FOOD_ITEMS: "/lookup/food-items",
  UNITS: "/lookup/units",
  BLOG_CATEGORIES: "/lookup/blog-categories",
  ONBOARDING_FORMS: "/lookup/onboarding-forms",
  PAYMENT_METHODS: "/lookup/payment-methods",
  INVOICE_USERS: "/lookup/invoice-users",
} as const;
