import { breadcrumbs } from "@/config/breadcrumbs";
import { BreadcrumbItem } from "@/types/shared/breadcrumb";
import { isAdminListPage } from "@/utils/admin/navigation";

import { addDefaultListParameters } from "./parameters";

const breadcrumbMap = new Map(Object.entries(breadcrumbs));

/**
 * Adds default list parameters to breadcrumb href for admin list pages
 */
const addParametersToListPages = (items: BreadcrumbItem[]): BreadcrumbItem[] => {
  return items.map((item) => {
    if (item.href && isAdminListPage(item.href)) {
      return {
        ...item,
        href: addDefaultListParameters(item.href),
      };
    }
    return item;
  });
};

/**
 * Retrieves breadcrumb items for a given pathname
 *
 * Matches pathname against configured breadcrumbs, supporting both exact
 * matches and dynamic routes with `:id` placeholders. Automatically adds
 * default query parameters to admin list page links.
 *
 * @param pathname - Current route pathname
 * @returns Breadcrumb items for the path, or default breadcrumbs if no match
 */
export const getBreadcrumbsForPath = (pathname: string): BreadcrumbItem[] => {
  if (!pathname || typeof pathname !== "string") {
    return getDefaultBreadcrumbs();
  }

  // Sanitize pathname to prevent injection attacks
  const sanitizedPath = pathname.replaceAll(/[^a-zA-Z0-9\/\-_:]/g, "");

  const exactMatch = getBreadcrumbs(sanitizedPath);
  if (exactMatch) {
    return addParametersToListPages(exactMatch);
  }

  // Try matching against dynamic routes
  const dynamicRoutes = getDynamicRoutes();
  for (const route of dynamicRoutes) {
    if (matchesDynamicRoute(sanitizedPath, route)) {
      const id = extractIdFromPath(sanitizedPath);
      const routeConfig = getBreadcrumbs(route);

      if (routeConfig && id) {
        return addParametersToListPages(replacePlaceholders(routeConfig, id));
      }
    }
  }

  return getDefaultBreadcrumbs();
};

/**
 * Dynamically adds a breadcrumb configuration for a specific path
 *
 * Allows runtime registration of breadcrumb configurations for routes
 * not defined in the static breadcrumb config. Sanitizes input for security.
 *
 * @param path - Route path to associate with breadcrumbs
 * @param breadcrumbs - Breadcrumb items for the path
 */
export const addBreadcrumb = (path: string, breadcrumbs: BreadcrumbItem[]) => {
  if (!path || typeof path !== "string" || !Array.isArray(breadcrumbs)) {
    return;
  }

  const sanitizedPath = path.replaceAll(/[^a-zA-Z0-9\/\-_:]/g, "");
  breadcrumbMap.set(sanitizedPath, breadcrumbs);
};

/**
 * Retrieves breadcrumb configuration for a path
 */
const getBreadcrumbs = (path: string): BreadcrumbItem[] | undefined => {
  return breadcrumbMap.get(path) as BreadcrumbItem[] | undefined;
};

/**
 * Gets all dynamic route patterns containing `:id` placeholders
 */
const getDynamicRoutes = (): string[] => {
  return [...breadcrumbMap.keys()].filter((route) => route.includes(":id"));
};

/**
 * Checks if pathname matches a dynamic route pattern
 *
 * Converts `:id` placeholders to regex patterns for flexible matching.
 */
const matchesDynamicRoute = (pathname: string, route: string): boolean => {
  const routePattern = route.replaceAll(":id", "[^/]+");
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regex = new RegExp(`^${routePattern}$`);
  return regex.test(pathname);
};

/**
 * Extracts ID parameter from the last path segment
 */
const extractIdFromPath = (pathname: string): string | undefined => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 0 ? segments.at(-1) : undefined;
};

/**
 * Replaces `:id` placeholders with actual ID values
 */
const replacePlaceholders = (config: BreadcrumbItem[], id: string): BreadcrumbItem[] => {
  return config.map((item) => ({
    ...item,
    href: item.href?.replace(":id", id),
  }));
};

/**
 * Returns default breadcrumb configuration
 */
const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
  return [{ label: "Admin Control Panel" }, { label: "Overview" }];
};
