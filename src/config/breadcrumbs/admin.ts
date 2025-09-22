import { Breadcrumbs } from "@/components/shared/breadcrumb/type";
import { PATHS } from "@/config/paths";

/**
 * Admin breadcrumb configuration
 * Defines the breadcrumb navigation structure for all admin routes.
 *
 * @returns The admin breadcrumb configuration
 */
export const adminBreadcrumbs: Breadcrumbs = {
  // Overview
  "/admin/overview": [
    { label: "Admin Control Panel" },
    { label: "Dashboard & Insights" },
    { label: "Overview", href: PATHS.ADMIN.OVERVIEW },
  ],

  // Enrollments
  "/admin/enrollments": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: "" },
    { label: "List" },
  ],

  "/admin/enrollments/create": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: "" },
    { label: "Create" },
  ],

  "/admin/enrollments/:id": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: "" },
    { label: "View Details" },
  ],

  "/admin/enrollments/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: "" },
    { label: "Edit" },
  ],
};
