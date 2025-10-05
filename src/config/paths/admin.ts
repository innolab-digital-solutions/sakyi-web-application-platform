/**
 * Administrative dashboard routes
 * Protected routes requiring authentication and admin privileges
 *
 * @returns The administrative dashboard route paths
 */
export const ADMIN_PATHS = {
  ROOT: "/admin",

  LOGIN: "/admin/login",

  OVERVIEW: "/admin/overview",

  PROGRAMS: {
    LIST: "/admin/programs",
    CREATE: "/admin/programs/create",
    EDIT: (id: string | number) => `/admin/programs/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/programs/${id}`,
  },

  ROLES: {
    LIST: "/admin/roles",
    ASSIGN_PERMISSIONS: (id: string | number) => `/admin/roles/${id}/assign-permissions`,
  },

  WORKOUT_CATEGORIES: {
    LIST: "/admin/workout-categories",
  },

  STAFF_ACCOUNTS: {
    LIST: "/admin/staff-accounts",
    CREATE: "/admin/staff-accounts/create",
    EDIT: (id: string | number) => `/admin/staff-accounts/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/staff-accounts/${id}`,
  },
} as const;
