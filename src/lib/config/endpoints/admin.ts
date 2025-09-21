/**
 * Administrative API endpoints
 * Protected endpoints requiring authentication and admin privileges
 *
 * @returns The administrative API endpoints
 */
export const ADMIN_ENDPOINTS = {
  OVERVIEW: "/admin/overview",

  PROGRAMS: {
    INDEX: "/admin/programs",
    SHOW: (id: string | number) => `/admin/programs/${id}`,
    STORE: "/admin/programs",
    UPDATE: (id: string | number) => `/admin/programs/${id}`,
    DESTROY: (id: string | number) => `/admin/programs/${id}`,
  },
} as const;
