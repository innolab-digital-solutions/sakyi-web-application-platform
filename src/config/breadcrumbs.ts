import { ADMIN } from "@/config/routes";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface BreadcrumbConfig {
  [key: string]: BreadcrumbItem[];
}

export const breadcrumbConfig: BreadcrumbConfig = {
  // Overview
  "/admin/overview": [
    { label: "Admin Control Panel" },
    { label: "Dashboard & Insights" },
    { label: "Overview", href: ADMIN.OVERVIEW },
  ],

  // Enrollments
  "/admin/enrollments": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: ADMIN.ENROLLMENTS.LIST },
    { label: "List" },
  ],

  "/admin/enrollments/create": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: ADMIN.ENROLLMENTS.LIST },
    { label: "Create" },
  ],

  "/admin/enrollments/:id": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: ADMIN.ENROLLMENTS.LIST },
    { label: "View Details" },
  ],

  "/admin/enrollments/:id/edit": [
    { label: "Admin Control Panel" },
    { label: "Programs & Clients" },
    { label: "Enrollments", href: ADMIN.ENROLLMENTS.LIST },
    { label: "Edit" },
  ],
};

// Function to get breadcrumbs for a specific path
export function getBreadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  // First, try exact match
  if (breadcrumbConfig[pathname]) {
    return breadcrumbConfig[pathname];
  }

  // Handle dynamic routes (with IDs)
  const dynamicRoutes = Object.keys(breadcrumbConfig).filter((route) => route.includes(":id"));

  for (const route of dynamicRoutes) {
    const routePattern = route.replace(":id", "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);

    if (regex.test(pathname)) {
      // Extract ID from pathname
      const id = pathname.split("/").pop();

      // Clone the breadcrumb config and replace placeholders
      return breadcrumbConfig[route].map((item) => ({
        ...item,
        href: item.href?.replace(":id", id || ""),
      }));
    }
  }

  // Default fallback
  return [{ label: "Admin Control Panel" }, { label: "Dashboard" }];
}

// Utility function to add new breadcrumb configurations
export function addBreadcrumbConfig(path: string, breadcrumbs: BreadcrumbItem[]) {
  breadcrumbConfig[path] = breadcrumbs;
}

// Utility function to get breadcrumb segments for easy manipulation
export function getBreadcrumbSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}
