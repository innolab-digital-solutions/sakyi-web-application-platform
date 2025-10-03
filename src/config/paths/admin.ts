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

  Food_CATEGORIES: {
    LIST: "/admin/nutrition/categories",
    CREATE: "/admin/nutrition/categories/create",
    EDIT: (id: string | number) => `/admin/nutrition/categories/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/nutrition/categories/${id}`,
  },
} as const;
