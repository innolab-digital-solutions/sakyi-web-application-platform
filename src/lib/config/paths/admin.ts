/**
 * Administrative dashboard routes
 *
 * Protected routes requiring authentication and admin privileges
 */
export const ADMIN_PATHS = {
  LOGIN: "/admin/login",

  OVERVIEW: "/admin/overview",

  PROGRAMS: {
    LIST: "/admin/programs",
    CREATE: "/admin/programs/create",
    EDIT: (id: string | number) => `/admin/programs/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/programs/${id}`,
  },
} as const;
