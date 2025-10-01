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

  // Roles
  "/admin/roles": [
    { label: "Admin Control Panel" },
    { label: "Administration & Access Control" },
    { label: "Roles & Permissions", href: PATHS.ADMIN.ROLES.LIST },
  ],

  "/admin/roles/:id/assign-permissions": [
    { label: "Admin Control Panel" },
    { label: "Administration & Access Control" },
    { label: "Roles & Permissions", href: PATHS.ADMIN.ROLES.LIST },
    { label: "Assign Permissions" },
  ],

  // Units of Measurement
  "/admin/nutrition/units": [
    { label: "Admin Control Panel" },
    { label: "Food & Nutrition" },
    { label: "Units of Measurement", href: PATHS.ADMIN.UNITS.LIST },
  ],
};
