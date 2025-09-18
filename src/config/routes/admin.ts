export const ADMIN = {
  LOGIN: "/admin/login",

  OVERVIEW: "/admin/overview",

  ENROLLMENTS: {
    LIST: "/admin/enrollments",
    CREATE: "/admin/enrollments/create",
    EDIT: (id: string | number) => `/admin/enrollments/${id}/edit`,
    DETAIL: (id: string | number) => `/admin/enrollments/${id}`,
  },
};
