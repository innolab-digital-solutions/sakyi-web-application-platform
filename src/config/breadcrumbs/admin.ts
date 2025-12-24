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
  /* -------------------------------------------------------------------------- */
  /* Dashboard & Insights                                                           */
  /* -------------------------------------------------------------------------- */

  "/admin/overview": [
    { label: "Admin Control Panel" },
    { label: "Dashboard & Insights" },
    { label: "Overview", href: PATHS.ADMIN.OVERVIEW },
  ],

  /* -------------------------------------------------------------------------- */
  /* Access & Organization                                                           */
  /* -------------------------------------------------------------------------- */

  "/admin/roles": [
    { label: "Admin Control Panel" },
    { label: "Access & Organization" },
    { label: "Roles & Permissions", href: PATHS.ADMIN.ROLES.LIST },
  ],

  "/admin/roles/:id/assign-permissions": [
    { label: "Admin Control Panel" },
    { label: "Access & Organization" },
    { label: "Roles & Permissions", href: PATHS.ADMIN.ROLES.LIST },
    { label: "Assign Permissions" },
  ],

  "/admin/users": [
    { label: "Admin Control Panel" },
    { label: "Access & Organization" },
    { label: "Accounts", href: PATHS.ADMIN.USERS.LIST },
  ],

  "/admin/teams": [
    { label: "Admin Control Panel" },
    { label: "Access & Organization" },
    { label: "Teams", href: PATHS.ADMIN.TEAMS.LIST },
  ],
  /* -------------------------------------------------------------------------- */
  /* Client Care & Services                                                  */
  /* -------------------------------------------------------------------------- */

  "/admin/programs": [
    { label: "Admin Control Panel" },
    { label: "Client Care & Services" },
    { label: "Programs", href: PATHS.ADMIN.PROGRAMS.LIST },
  ],

  "/admin/programs/create": [
    { label: "Admin Control Panel" },
    { label: "Client Care & Services" },
    { label: "Programs", href: PATHS.ADMIN.PROGRAMS.LIST },
    { label: "Create" },
  ],

  "/admin/programs/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Client Care & Services" },
    { label: "Programs", href: PATHS.ADMIN.PROGRAMS.LIST },
    { label: "Edit" },
  ],

  "/admin/programs/:id/preview": [
    { label: "Admin Control Panel" },
    { label: "Client Care & Services" },
    { label: "Programs", href: PATHS.ADMIN.PROGRAMS.LIST },
    { label: "Preview" },
  ],

  "/admin/clients": [
    { label: "Admin Control Panel" },
    { label: "Client Care & Services" },
    { label: "Clients", href: PATHS.ADMIN.CLIENTS.LIST },
  ],

  "/admin/enrollments": [
    { label: "Admin Control Panel" },
    { label: "Client Care & Services" },
    { label: "Enrollments", href: PATHS.ADMIN.ENROLLMENTS.LIST },
  ],

  /* -------------------------------------------------------------------------- */
  /* Nutrition & Training Library                                                  */
  /* -------------------------------------------------------------------------- */

  "/admin/units": [
    { label: "Admin Control Panel" },
    { label: "Nutrition & Training Library" },
    { label: "Measurement Units", href: PATHS.ADMIN.UNITS.LIST },
  ],

  "/admin/food-categories": [
    { label: "Admin Control Panel" },
    { label: "Nutrition & Training Library" },
    { label: "Nutrition" },
    { label: "Food Categories", href: PATHS.ADMIN.FOOD_CATEGORIES.LIST },
  ],
  "/admin/food-items": [
    { label: "Admin Control Panel" },
    { label: "Nutrition & Training Library" },
    { label: "Nutrition" },
    { label: "Food Items", href: PATHS.ADMIN.FOOD_ITEMS.LIST },
  ],

  "/admin/workout-categories": [
    { label: "Admin Control Panel" },
    { label: "Nutrition & Training Library" },
    { label: "Workouts" },
    { label: "Categories", href: PATHS.ADMIN.WORKOUT_CATEGORIES.LIST },
  ],

  "/admin/workouts": [
    { label: "Admin Control Panel" },
    { label: "Nutrition & Training Library" },
    { label: "Workouts" },
    { label: "Exercises", href: PATHS.ADMIN.WORKOUTS.LIST },
  ],

  /* -------------------------------------------------------------------------- */
  /* Billing & Payments                                                          */
  /* -------------------------------------------------------------------------- */

  "/admin/payment-methods": [
    { label: "Admin Control Panel" },
    { label: "Billing & Payments" },
    { label: "Payment Methods", href: PATHS.ADMIN.PAYMENT_METHODS.LIST },
  ],

  "/admin/invoices": [
    { label: "Admin Control Panel" },
    { label: "Billing & Payments" },
    { label: "Invoices", href: PATHS.ADMIN.INVOICES.LIST },
  ],

  /* -------------------------------------------------------------------------- */
  /* Content & Engagement                                                          */
  /* -------------------------------------------------------------------------- */

  "/admin/blog-categories": [
    { label: "Admin Control Panel" },
    { label: "Content & Engagement" },
    { label: "Blog" },
    { label: "Categories", href: PATHS.ADMIN.BLOG_CATEGORIES.LIST },
  ],

  "/admin/blog-posts": [
    { label: "Admin Control Panel" },
    { label: "Content & Engagement" },
    { label: "Blog" },
    { label: "Posts", href: PATHS.ADMIN.BLOG_POSTS.LIST },
  ],

  "/admin/blog-posts/create": [
    { label: "Admin Control Panel" },
    { label: "Content & Engagement" },
    { label: "Blog" },
    { label: "Posts", href: PATHS.ADMIN.BLOG_POSTS.LIST },
    { label: "Create" },
  ],

  "/admin/blog-posts/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Content & Engagement" },
    { label: "Blog" },
    { label: "Posts", href: PATHS.ADMIN.BLOG_POSTS.LIST },
    { label: "Edit" },
  ],

  "/admin/blog-posts/:id/preview": [
    { label: "Admin Control Panel" },
    { label: "Content & Engagement" },
    { label: "Blog" },
    { label: "Posts", href: PATHS.ADMIN.BLOG_POSTS.LIST },
    { label: "Preview" },
  ],

  "/admin/testimonials": [
    { label: "Admin Control Panel" },
    { label: "Content & Engagement" },
    { label: "Testimonials", href: PATHS.ADMIN.TESTIMONIALS.LIST },
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

  "/admin/invoices/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Finance" },
    { label: "Invoices", href: PATHS.ADMIN.INVOICES.LIST },
    { label: "Edit" },
  ],

  "/admin/invoices/create": [
    { label: "Admin Control Panel" },
    { label: "Finance" },
    { label: "Invoices", href: PATHS.ADMIN.INVOICES.LIST },
    { label: "Create" },
  ],
};
