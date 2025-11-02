/**
 * Route permission configuration
 *
 * Maps admin routes to their required permissions. This configuration
 * is separate from navigation and ensures all routes (even those not
 * in the sidebar) can have permission requirements enforced.
 *
 * Routes not listed here will be denied by default (secure by default).
 * Routes listed with empty string or undefined permission are accessible
 * to all authenticated users.
 *
 * Permission format: "module.action" (e.g., "example.view", "roles.create")
 *
 * @example
 * ```ts
 * "/admin/example": "example.view"
 * "/admin/users": "users.view"
 * "/admin/roles/:id/assign-permissions": "roles.update"
 * ```
 */
export const routePermissions: Record<string, string | undefined> = {
  // Dashboard - always accessible to authenticated users
  "/admin/overview": undefined,

  // Roles & Permissions
  "/admin/roles": "roles.view",
  "/admin/roles/:id/assign-permissions": "roles.update",

  // Programs
  "/admin/programs": "programs.view",

  // Onboarding Forms
  "/admin/onboarding-forms": "onboarding-forms.view",
  "/admin/onboarding-forms/create": "onboarding-forms.create",
  "/admin/onboarding-forms/:id/edit": "onboarding-forms.update",
  "/admin/onboarding-forms/:id": "onboarding-forms.view",

  // Units
  "/admin/units": "units.view",

  // Food Categories
  "/admin/food-categories": "food-categories.view",

  // Food Items
  "/admin/food-items": "food-items.view",

  // Workout Categories
  "/admin/workout-categories": "workout-categories.view",

  // Blog Categories
  "/admin/blog-categories": "blog-categories.view",

  // Example route (user's request)
  "/admin/example": "example.view",

  // Add more routes as needed
  // "/admin/your-route": "your-module.view",
} as const;

/**
 * Get required permission for a route path
 *
 * Handles dynamic route patterns (e.g., "/admin/roles/:id/edit")
 * by matching against actual paths.
 *
 * @param pathname - Actual route path (e.g., "/admin/roles/123/edit")
 * @returns Required permission string or undefined
 */
export function getRoutePermission(pathname: string): string | undefined {
  // Direct match
  if (routePermissions[pathname] !== undefined) {
    return routePermissions[pathname];
  }

  // Check dynamic route patterns
  for (const [pattern, permission] of Object.entries(routePermissions)) {
    if (matchesRoutePattern(pathname, pattern)) {
      return permission;
    }
  }

  return undefined;
}

/**
 * Check if a pathname matches a route pattern
 *
 * Converts route patterns with :id placeholders to regex
 * and matches against actual paths.
 *
 * @param pathname - Actual path (e.g., "/admin/roles/123/edit")
 * @param pattern - Route pattern (e.g., "/admin/roles/:id/edit")
 * @returns True if pathname matches pattern
 */
function matchesRoutePattern(pathname: string, pattern: string): boolean {
  // Convert pattern to regex: replace :param with [^/]+
  const regexPattern = pattern.replaceAll(/:[^/]+/g, "[^/]+");
  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(pathname);
}

/**
 * Check if a route is explicitly configured in route permissions
 *
 * @param pathname - Route path to check
 * @returns True if route is configured (even if permission is undefined)
 */
export function isRouteConfigured(pathname: string): boolean {
  // Direct match
  if (pathname in routePermissions) {
    return true;
  }

  // Check dynamic patterns
  for (const pattern of Object.keys(routePermissions)) {
    if (matchesRoutePattern(pathname, pattern)) {
      return true;
    }
  }

  return false;
}
