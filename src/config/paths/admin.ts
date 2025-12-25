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

  USERS: {
    LIST: "/admin/users",
    CREATE: "/admin/users/create",
    EDIT: (id: string | number) => `/admin/users/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/users/${id}`,
  },

  TEAMS: {
    LIST: "/admin/teams",
    CREATE: "/admin/teams/create",
    EDIT: (id: string | number) => `/admin/teams/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/teams/${id}`,
    ASSIGN_MEMBERS: (id: string | number) => `/admin/teams/${id}/assign-members`,
  },

  /** Programs routes */
  PROGRAMS: {
    LIST: "/admin/programs",
    CREATE: "/admin/programs/create",
    EDIT: (id: string | number) => `/admin/programs/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/programs/${id}`,
    PREVIEW: (slug: string) => `/admin/programs/${slug}/preview`,
  },

  /** Enrollments routes */
  ENROLLMENTS: {
    LIST: "/admin/enrollments",
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
    CREATE: "/admin/workout-categories/create",
    EDIT: (id: string | number) => `/admin/workout-categories/${id}/edit`,
  },

  /** Workouts routes */
  WORKOUTS: {
    LIST: "/admin/workouts",
    CREATE: "/admin/workouts/create",
    EDIT: (id: string | number) => `/admin/workouts/${id}/edit`,
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
    PREVIEW: (slug: string) => `/admin/blog-posts/${slug}/preview`,
  },

  /** Payment methods routes */
  PAYMENT_METHODS: {
    LIST: "/admin/payment-methods",
    CREATE: "/admin/payment-methods/create",
    EDIT: (id: string | number) => `/admin/payment-methods/${id}/edit`,
  },

  /** Testimonials routes */
  TESTIMONIALS: {
    LIST: "/admin/testimonials",
    CREATE: "/admin/testimonials/create",
    EDIT: (id: string | number) => `/admin/testimonials/${id}/edit`,
  },

  /** Invoices routes */
  INVOICES: {
    LIST: "/admin/invoices",
    CREATE: "/admin/invoices/create",
    EDIT: (id: string | number) => `/admin/invoices/${id}/edit`,
  },

  /** Instructions routes */
  INSTRUCTIONS: {
    LIST: "/admin/instructions",
    CREATE: "/admin/instructions/create",
    EDIT: (id: string | number) => `/admin/instructions/${id}/edit`,
  },

  /** Clients routes */
  CLIENTS: {
    LIST: "/admin/clients",
  },
} as const;
