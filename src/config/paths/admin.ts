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
  },
} as const;
