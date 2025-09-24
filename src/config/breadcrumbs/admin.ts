import { PATHS } from "@/config/paths";
import { Breadcrumbs } from "@/types/shared/breadcrumb";

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

  // Programs
  "/admin/programs": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Programs", href: "" },
    { label: "List" },
  ],

  "/admin/programs/create": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Programs", href: "" },
    { label: "Create" },
  ],

  "/admin/programs/:id": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Programs", href: "" },
    { label: "View Details" },
  ],

  "/admin/programs/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Programs", href: "" },
    { label: "Edit" },
  ],
};
