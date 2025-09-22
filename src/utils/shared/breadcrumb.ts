import { breadcrumbs } from "@/config/breadcrumbs";
import { BreadcrumbItem } from "@/types/shared/breadcrumb";

// Create a secure Map for breadcrumb access
const breadcrumbMap = new Map(Object.entries(breadcrumbs));

/**
 * Retrieves breadcrumb items for a given pathname.
 * Handles both exact matches and dynamic routes with ID parameters.
 *
 * @param pathname - The current pathname to match against breadcrumb configuration
 * @returns Array of breadcrumb items for the given path, or default breadcrumbs if no match found
 */
export const getBreadcrumbsForPath = (pathname: string): BreadcrumbItem[] => {
  if (!pathname || typeof pathname !== "string") {
    return getDefaultBreadcrumbs();
  }

  const sanitizedPath = pathname.replaceAll(/[^a-zA-Z0-9\/\-_:]/g, "");

  const exactMatch = getBreadcrumbs(sanitizedPath);
  if (exactMatch) {
    return exactMatch;
  }

  const dynamicRoutes = getDynamicRoutes();

  for (const route of dynamicRoutes) {
    if (matchesDynamicRoute(sanitizedPath, route)) {
      const id = extractIdFromPath(sanitizedPath);
      const routeConfig = getBreadcrumbs(route);

      if (routeConfig && id) {
        return replacePlaceholders(routeConfig, id);
      }
    }
  }

  return getDefaultBreadcrumbs();
};

/**
 * Adds a new breadcrumb configuration for a specific path.
 * Validates inputs and sanitizes the path before storing.
 *
 * @param path - The path to associate with the breadcrumb configuration
 * @param breadcrumbs - Array of breadcrumb items for the specified path
 */
export const addBreadcrumb = (path: string, breadcrumbs: BreadcrumbItem[]) => {
  if (!path || typeof path !== "string" || !Array.isArray(breadcrumbs)) {
    return;
  }

  const sanitizedPath = path.replaceAll(/[^a-zA-Z0-9\/\-_:]/g, "");
  breadcrumbMap.set(sanitizedPath, breadcrumbs);
};

/**
 * Splits a pathname into individual segments, filtering out empty strings.
 *
 * @param pathname - The pathname to split into segments
 * @returns Array of path segments without empty strings
 */
export const getBreadcrumbSegments = (pathname: string): string[] => {
  return pathname.split("/").filter(Boolean);
};

/**
 * Updates the label of a breadcrumb item at a specific index.
 * Returns a new array with the updated breadcrumb item.
 *
 * @param breadcrumbs - The array of breadcrumb items to update
 * @param index - The index of the breadcrumb item to update
 * @param newLabel - The new label to set for the breadcrumb item
 * @returns New array with the updated breadcrumb item
 */
export const updateBreadcrumbLabel = (
  breadcrumbs: BreadcrumbItem[],
  index: number,
  newLabel: string,
): BreadcrumbItem[] => {
  return breadcrumbs.map((item, index_) =>
    index_ === index ? { ...item, label: newLabel } : item,
  );
};

/**
 * Safely retrieves breadcrumb configuration for a given path.
 *
 * @param path - The path to lookup in the breadcrumb configuration
 * @returns Breadcrumb items array if found, undefined otherwise
 */
const getBreadcrumbs = (path: string): BreadcrumbItem[] | undefined => {
  return breadcrumbMap.get(path);
};

/**
 * Retrieves all dynamic route patterns that contain ID parameters.
 *
 * @returns Array of route patterns that include ":id" placeholders
 */
const getDynamicRoutes = (): string[] => {
  return [...breadcrumbMap.keys()].filter((route) => route.includes(":id"));
};

/**
 * Checks if a pathname matches a dynamic route pattern.
 * Converts ":id" placeholders to regex patterns for matching.
 *
 * @param pathname - The pathname to test against the route pattern
 * @param route - The route pattern with ":id" placeholders
 * @returns True if the pathname matches the dynamic route pattern
 */
const matchesDynamicRoute = (pathname: string, route: string): boolean => {
  const routePattern = route.replaceAll(":id", "[^/]+");
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regex = new RegExp(`^${routePattern}$`);
  return regex.test(pathname);
};

/**
 * Extracts the ID parameter from the last segment of a pathname.
 *
 * @param pathname - The pathname to extract the ID from
 * @returns The extracted ID string, or undefined if no valid segments found
 */
const extractIdFromPath = (pathname: string): string | undefined => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 0 ? segments.at(-1) : undefined;
};

/**
 * Replaces ":id" placeholders in breadcrumb configuration with actual ID values.
 *
 * @param config - The breadcrumb configuration array with placeholders
 * @param id - The ID value to replace placeholders with
 * @returns New breadcrumb configuration with placeholders replaced
 */
const replacePlaceholders = (config: BreadcrumbItem[], id: string): BreadcrumbItem[] => {
  return config.map((item) => ({
    ...item,
    href: item.href?.replace(":id", id),
  }));
};

/**
 * Returns the default breadcrumb configuration when no specific match is found.
 *
 * @returns Default breadcrumb items for admin dashboard
 */
const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
  return [{ label: "Admin Control Panel" }, { label: "Overview" }];
};
