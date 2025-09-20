/**
 * Administrative API endpoints
 *
 * Protected endpoints requiring authentication and admin privileges
 */
export const ADMIN_API = {
  OVERVIEW: "/admin/overview",

  PROGRAMS: {
    INDEX: "/admin/programs",
    SHOW: (id: string | number) => `/admin/programs/${id}`,
    STORE: "/admin/programs",
    UPDATE: (id: string | number) => `/admin/programs/${id}`,
    DESTROY: (id: string | number) => `/admin/programs/${id}`,
  },
} as const;
