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

  /** Main dashboard overview */
  OVERVIEW: "/admin/overview",

  /** Program management routes */
  PROGRAMS: {
    LIST: "/admin/programs",
    CREATE: "/admin/programs/create",
    EDIT: (id: string | number) => `/admin/programs/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/programs/${id}`,
  },

  /** Role and permission management routes */
  ROLES: {
    LIST: "/admin/roles",
    ASSIGN_PERMISSIONS: (id: string | number) => `/admin/roles/${id}/assign-permissions`,
  },

  /** Workout category management routes */
  WORKOUT_CATEGORIES: {
    LIST: "/admin/workout-categories",
  },

  /** Unit of measurement management routes */
  UNITS: {
    LIST: "/admin/units",
  },

  /** Food category management routes */
  FOOD_CATEGORIES: {
    LIST: "/admin/food-categories",
  },

  FOOD_ITEMS: {
    LIST: "/admin/food-items",
    CREATE: "/admin/food-items/create",
    EDIT: (id: string | number) => `/admin/food-items/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/food-items/${id}`,
  },

  BLOG_CATEGORIES: {
    LIST: "/admin/blog-categories",
  },
} as const;
