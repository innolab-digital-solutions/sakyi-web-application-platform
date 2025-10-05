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

  // Staff Accounts
  "/admin/staff-accounts": [
    { label: "Admin Control Panel" },
    { label: "Administration & Access Control" },
    { label: "Staff Accounts", href: PATHS.ADMIN.STAFF_ACCOUNTS.LIST },
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

  "/admin/workout-categories": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Workout Library" },
    { label: "Workout Categories", href: PATHS.ADMIN.WORKOUT_CATEGORIES.LIST },
  ],
};
