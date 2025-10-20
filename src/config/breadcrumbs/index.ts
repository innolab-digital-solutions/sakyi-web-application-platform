/**
 * Breadcrumb configuration
 *
 * Centralized breadcrumb trail definitions for all routes.
 * Maps route paths to breadcrumb item arrays.
 *
 * Supports dynamic routes with `:id` placeholders that are
 * replaced at runtime by `getBreadcrumbsForPath()` utility.
 */
export { adminBreadcrumbs as breadcrumbs } from "@/config/breadcrumbs/admin";
