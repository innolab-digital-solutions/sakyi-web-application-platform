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

  /** Role and permissions endpoints */
  ROLES: {
    INDEX: "/admin/roles",
    SHOW: (id: string | number) => `/admin/roles/${id}`,
    STORE: "/admin/roles",
    UPDATE: (id: string | number) => `/admin/roles/${id}`,
    ASSIGN_PERMISSIONS: (id: string | number) => `/admin/roles/${id}/assign-permissions`,
    DESTROY: (id: string | number) => `/admin/roles/${id}`,
  },

  USERS: {
    INDEX: "/admin/users",
    SHOW: (id: string | number) => `/admin/users/${id}`,
    STORE: "/admin/users",
    UPDATE: (id: string | number) => `/admin/users/${id}`,
    DESTROY: (id: string | number) => `/admin/users/${id}`,
  },

  TEAMS: {
    INDEX: "/admin/teams",
    SHOW: (id: string | number) => `/admin/teams/${id}`,
    STORE: "/admin/teams",
    UPDATE: (id: string | number) => `/admin/teams/${id}`,
    DESTROY: (id: string | number) => `/admin/teams/${id}`,
    ASSIGN_MEMBERS: (id: string | number) => `/admin/teams/${id}/assign-members`,
  },

  /** Programs endpoints */
  PROGRAMS: {
    INDEX: "/admin/programs",
    SHOW: (id: string | number) => `/admin/programs/${id}`,
    STORE: "/admin/programs",
    UPDATE: (id: string | number) => `/admin/programs/${id}`,
    CHANGE_STATUS: (id: string | number) => `/admin/programs/${id}/status`,
    DESTROY: (id: string | number) => `/admin/programs/${id}`,
  },

  /** Onboarding forms endpoints */
  ONBOARDING_FORMS: {
    INDEX: "/admin/onboarding-forms",
    SHOW: (id: string | number) => `/admin/onboarding-forms/${id}`,
    STORE: "/admin/onboarding-forms",
    UPDATE: (id: string | number) => `/admin/onboarding-forms/${id}`,
    CHANGE_STATUS: (id: string | number) => `/admin/onboarding-forms/${id}/status`,
    DESTROY: (id: string | number) => `/admin/onboarding-forms/${id}`,
  },

  /** Units endpoints */
  UNITS: {
    INDEX: "/admin/units",
    SHOW: (id: string | number) => `/admin/units/${id}`,
    STORE: "/admin/units",
    UPDATE: (id: string | number) => `/admin/units/${id}`,
    DESTROY: (id: string | number) => `/admin/units/${id}`,
  },

  /** Food categories endpoints */
  FOOD_CATEGORIES: {
    INDEX: "/admin/food-categories",
    SHOW: (id: string | number) => `/admin/food-categories/${id}`,
    STORE: "/admin/food-categories",
    UPDATE: (id: string | number) => `/admin/food-categories/${id}`,
    DESTROY: (id: string | number) => `/admin/food-categories/${id}`,
  },

  /** Food items endpoints */
  FOOD_ITEMS: {
    INDEX: "/admin/food-items",
    SHOW: (id: string | number) => `/admin/food-items/${id}`,
    STORE: "/admin/food-items",
    UPDATE: (id: string | number) => `/admin/food-items/${id}`,
    DESTROY: (id: string | number) => `/admin/food-items/${id}`,
  },

  /** Workout categories endpoints */
  WORKOUT_CATEGORIES: {
    INDEX: "/admin/workout-categories",
    SHOW: (id: string | number) => `/admin/workout-categories/${id}`,
    STORE: "/admin/workout-categories",
    UPDATE: (id: string | number) => `/admin/workout-categories/${id}`,
    DESTROY: (id: string | number) => `/admin/workout-categories/${id}`,
  },

  /** Workouts endpoints */
  WORKOUTS: {
    INDEX: "/admin/workouts",
    SHOW: (id: string | number) => `/admin/workouts/${id}`,
    STORE: "/admin/workouts",
    UPDATE: (id: string | number) => `/admin/workouts/${id}`,
    DESTROY: (id: string | number) => `/admin/workouts/${id}`,
  },

  /** Blog categories endpoints */
  BLOG_CATEGORIES: {
    INDEX: "/admin/blog-categories",
    SHOW: (id: string | number) => `/admin/blog-categories/${id}`,
    STORE: "/admin/blog-categories",
    UPDATE: (id: string | number) => `/admin/blog-categories/${id}`,
    DESTROY: (id: string | number) => `/admin/blog-categories/${id}`,
  },

  /** Blog posts endpoints */
  BLOG_POSTS: {
    INDEX: "/admin/blog-posts",
    SHOW: (id: string | number) => `/admin/blog-posts/${id}`,
    STORE: "/admin/blog-posts",
    UPDATE: (id: string | number) => `/admin/blog-posts/${id}`,
    DESTROY: (id: string | number) => `/admin/blog-posts/${id}`,
  },

  /** Payment methods endpoints */
  PAYMENT_METHODS: {
    INDEX: "/admin/payment-methods",
    SHOW: (id: string | number) => `/admin/payment-methods/${id}`,
    STORE: "/admin/payment-methods",
    UPDATE: (id: string | number) => `/admin/payment-methods/${id}`,
    DESTROY: (id: string | number) => `/admin/payment-methods/${id}`,
  },

  /** Testimonials */
  TESTIMONIALS: {
    INDEX: "/admin/testimonials",
    SHOW: (id: string | number) => `/admin/testimonials/${id}`,
    STORE: "/admin/testimonials",
    UPDATE: (id: string | number) => `/admin/testimonials/${id}`,
    DESTROY: (id: string | number) => `/admin/testimonials/${id}`,
  },
} as const;
