import { PATHS } from "@/config/paths";
import { Breadcrumbs } from "@/types/shared/breadcrumb";

/**
 * Admin breadcrumb configuration
 *
 * Defines breadcrumb trails for admin dashboard routes.
 * Each key is a route path, value is an array of breadcrumb items.
 *
 * Breadcrumb structure:
 * - Items without `href` are non-clickable (current page or section header)
 * - Items with `href` are clickable navigation links
 * - Use `:id` placeholder for dynamic routes (replaced at runtime)
 *
 * Convention:
 * 1. "Admin Control Panel" (root)
 * 2. Section name (from sidebar groups)
 * 3. Page name (clickable if not current page)
 */
export const adminBreadcrumbs: Breadcrumbs = {
  /** Dashboard overview page */
  "/admin/overview": [
    { label: "Admin Control Panel" },
    { label: "Dashboard & Insights" },
    { label: "Overview", href: PATHS.ADMIN.OVERVIEW },
  ],

  /** Roles list page */
  "/admin/roles": [
    { label: "Admin Control Panel" },
    { label: "Administration & Access Control" },
    { label: "Roles & Permissions", href: PATHS.ADMIN.ROLES.LIST },
  ],

  /** Assign permissions form page (dynamic: :id replaced at runtime) */
  "/admin/roles/:id/assign-permissions": [
    { label: "Admin Control Panel" },
    { label: "Administration & Access Control" },
    { label: "Roles & Permissions", href: PATHS.ADMIN.ROLES.LIST },
    { label: "Assign Permissions" },
  ],

  /** Programs list page */
  "/admin/programs": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Program Management", href: PATHS.ADMIN.PROGRAMS.LIST },
  ],

  /** Programs create page */
  "/admin/programs/create": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Program Management", href: PATHS.ADMIN.PROGRAMS.LIST },
    { label: "Create" },
  ],

  /** Programs edit page (dynamic: :id replaced at runtime) */
  "/admin/programs/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Program Management", href: PATHS.ADMIN.PROGRAMS.LIST },
    { label: "Edit" },
  ],

  /** Onboarding forms list page */
  "/admin/onboarding-forms": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Onboarding" },
    { label: "Forms", href: PATHS.ADMIN.ONBOARDING_FORMS.LIST },
  ],

  /** Onboarding forms create page */
  "/admin/onboarding-forms/create": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Onboarding" },
    { label: "Forms", href: PATHS.ADMIN.ONBOARDING_FORMS.LIST },
    { label: "Create" },
  ],

  /** Onboarding forms edit page (dynamic: :id replaced at runtime) */
  "/admin/onboarding-forms/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Onboarding" },
    { label: "Forms", href: PATHS.ADMIN.ONBOARDING_FORMS.LIST },
    { label: "Edit" },
  ],

  /** Units list page */
  "/admin/units": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Food & Nutrition" },
    { label: "Units", href: PATHS.ADMIN.UNITS.LIST },
  ],

  /** Food categories list page */
  "/admin/food-categories": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Food & Nutrition" },
    { label: "Food Categories", href: PATHS.ADMIN.FOOD_CATEGORIES.LIST },
  ],

  /** Food items list page */
  "/admin/food-items": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Food & Nutrition" },
    { label: "Food Items", href: PATHS.ADMIN.FOOD_ITEMS.LIST },
  ],

  /** Workout categories list page */
  "/admin/workout-categories": [
    { label: "Admin Control Panel" },
    { label: "Health Data & Plans" },
    { label: "Workout Library" },
    { label: "Workout Categories", href: PATHS.ADMIN.WORKOUT_CATEGORIES.LIST },
  ],

  /** Payment Methods list page */
  "/admin/payments": [
    { label: "Admin Control Panel" },
    { label: "Finance" },
    { label: "Payment Methods", href: PATHS.ADMIN.PAYMENT_METHODS.LIST },
  ],

  /** Blog categories list page */
  "/admin/blog-categories": [
    { label: "Admin Control Panel" },
    { label: "Content Management" },
    { label: "Blog" },
    { label: "Blog Categories", href: PATHS.ADMIN.BLOG_CATEGORIES.LIST },
  ],
};
