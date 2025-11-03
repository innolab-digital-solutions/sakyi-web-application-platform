/**
 * Admin dashboard route paths
 *
 * Protected routes requiring authentication and appropriate permissions.
 * All routes are prefixed with `/admin`.
 */
export const ADMIN_PATHS = {
  /** Admin root - redirects to overview or login based on auth */
  ROOT: "/admin",

  /** Admin login page */
  LOGIN: "/admin/login",

  /** Dashboard overview */
  OVERVIEW: "/admin/overview",

  /** Role and permissions routes */
  ROLES: {
    LIST: "/admin/roles",
    ASSIGN_PERMISSIONS: (id: string | number) => `/admin/roles/${id}/assign-permissions`,
  },

  /** Programs routes */
  PROGRAMS: {
    LIST: "/admin/programs",
  },

  /** Onboarding forms routes */
  ONBOARDING_FORMS: {
    LIST: "/admin/onboarding-forms",
    CREATE: "/admin/onboarding-forms/create",
    EDIT: (id: string | number) => `/admin/onboarding-forms/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/onboarding-forms/${id}`,
  },

  /** Units routes */
  UNITS: {
    LIST: "/admin/units",
  },

  /** Food categories routes */
  FOOD_CATEGORIES: {
    LIST: "/admin/food-categories",
  },

  /** Food items routes */
  FOOD_ITEMS: {
    LIST: "/admin/food-items",
  },

  /** Workout categories routes */
  WORKOUT_CATEGORIES: {
    LIST: "/admin/workout-categories",
  },

  /** Blog categories routes */
  BLOG_CATEGORIES: {
    LIST: "/admin/blog-categories",
  },

  /** Blog posts routes */
  BLOG_POSTS: {
    LIST: "/admin/blog-posts",
    CREATE: "/admin/blog-posts/create",
    EDIT: (id: string | number) => `/admin/blog-posts/${id}/edit`,
  },
} as const;
