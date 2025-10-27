/**
 * Admin API endpoints
 *
 * RESTful API endpoints for admin resources. All endpoints require authentication
 * and appropriate permissions.
 *
 * Naming convention follows Laravel resource controller actions:
 * - **INDEX**: List all resources (GET)
 * - **SHOW**: Get single resource (GET)
 * - **STORE**: Create new resource (POST)
 * - **UPDATE**: Update existing resource (PUT/PATCH)
 * - **DESTROY**: Delete resource (DELETE)
 */
export const ADMIN_ENDPOINTS = {
  /** Dashboard overview data */
  OVERVIEW: "/admin/overview",

  /** Program management endpoints */
  PROGRAMS: {
    INDEX: "/admin/programs",
    SHOW: (id: string | number) => `/admin/programs/${id}`,
    STORE: "/admin/programs",
    UPDATE: (id: string | number) => `/admin/programs/${id}`,
    DESTROY: (id: string | number) => `/admin/programs/${id}`,
  },

  /** Role and permission management endpoints */
  ROLES: {
    INDEX: "/admin/roles",
    SHOW: (id: string | number) => `/admin/roles/${id}`,
    STORE: "/admin/roles",
    UPDATE: (id: string | number) => `/admin/roles/${id}`,
    ASSIGN_PERMISSIONS: (id: string | number) => `/admin/roles/${id}/assign-permissions`,
    DESTROY: (id: string | number) => `/admin/roles/${id}`,
  },

  /** Workout category endpoints */
  WORKOUT_CATEGORIES: {
    INDEX: "/admin/workout-categories",
    SHOW: (id: string | number) => `/admin/workout-categories/${id}`,
    STORE: "/admin/workout-categories",
    UPDATE: (id: string | number) => `/admin/workout-categories/${id}`,
    DESTROY: (id: string | number) => `/admin/workout-categories/${id}`,
  },

  /** Unit of measurement endpoints */
  UNITS: {
    INDEX: "/admin/units",
    SHOW: (id: string | number) => `/admin/units/${id}`,
    STORE: "/admin/units",
    UPDATE: (id: string | number) => `/admin/units/${id}`,
    DESTROY: (id: string | number) => `/admin/units/${id}`,
  },

  /** Food category endpoints */
  FOOD_CATEGORIES: {
    INDEX: "/admin/food-categories",
    SHOW: (id: string | number) => `/admin/food-categories/${id}`,
    STORE: "/admin/food-categories",
    UPDATE: (id: string | number) => `/admin/food-categories/${id}`,
    DESTROY: (id: string | number) => `/admin/food-categories/${id}`,
  },

  FOOD_ITEMS: {
    INDEX: "/admin/food-items",
    SHOW: (id: string | number) => `/admin/food-items/${id}`,
    STORE: "/admin/food-items",
    UPDATE: (id: string | number) => `/admin/food-items/${id}`,
    DESTROY: (id: string | number) => `/admin/food-items/${id}`,
  },

  /** Blog category endpoints */
  BLOG_CATEGORIES: {
    INDEX: "/admin/blog-categories",
    SHOW: (id: string | number) => `/admin/blog-categories/${id}`,
    STORE: "/admin/blog-categories",
    UPDATE: (id: string | number) => `/admin/blog-categories/${id}`,
    DESTROY: (id: string | number) => `/admin/blog-categories/${id}`,
  },
} as const;
