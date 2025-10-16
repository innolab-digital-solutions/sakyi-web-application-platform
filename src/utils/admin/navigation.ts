import { NavGroup } from "@/types/shared/navigation";

/**
 * Checks if a path is an admin list/table page that should have default parameters
 *
 * @param path - The path to check
 * @returns True if the path is an admin list page
 */
export const isAdminListPage = (path: string): boolean => {
  // List pages are typically plural resources without additional segments
  const listPagePatterns = [
    /\/admin\/workout-categories$/,
    /\/admin\/food-categories$/,
    /\/admin\/units$/,
    /\/admin\/roles$/,
    /\/admin\/users$/,
    /\/admin\/staff$/,
    /\/admin\/programs$/,
    /\/admin\/enrollments$/,
  ];

  return listPagePatterns.some((pattern) => pattern.test(path));
};

/**
 * Get the active admin navigation
 *
 * @param currentPath - The current route pathname to match against navigation items
 * @param navigation - Array of navigation groups containing admin menu structure
 * @returns Updated navigation groups with active states properly set
 */
export const getActiveAdminNav = (currentPath: string, navigation: NavGroup[]) => {
  return navigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      active:
        currentPath === item.path ||
        currentPath.startsWith(item.path + "/") ||
        item.subitems?.some(
          (sub) => currentPath === sub.path || currentPath.startsWith(sub.path + "/"),
        ) ||
        false,
      subitems: item.subitems?.map((sub) => ({
        ...sub,
        active: currentPath === sub.path || currentPath.startsWith(sub.path + "/"),
      })),
    })),
  }));
};

/**
 * Filter navigation groups and items based on permission helper.
 * Special case: /admin/overview (Overview page) has empty permission and is always shown.
 * All other empty permissions are treated as "not configured" and hidden.
 * Items with a non-empty permission string are checked against the canFunction.
 * A parent with subitems is kept if it is allowed OR has at least one allowed subitem.
 *
 * @param navigation - The full navigation config
 * @param canFn - Function that returns true/false for a given permission string
 * @returns Navigation filtered to only items the user can access
 */
export const filterNavByPermission = (
  navigation: NavGroup[],
  canFunction: (permission: string) => boolean,
): NavGroup[] => {
  return navigation
    .map((group) => {
      const filteredItems = group.items
        .map((item) => {
          // Special case: Overview page (/admin/overview) is always accessible
          const isOverviewPage = item.path === "/admin/overview";

          // Empty permission = not configured (hide), except for Overview page
          // Non-empty permission = check if user has that permission
          const parentAllowed = isOverviewPage
            ? true
            : !item.permission || item.permission.trim().length === 0
              ? false
              : canFunction(item.permission);

          if (item.subitems && item.subitems.length > 0) {
            const filteredSubitems = item.subitems.filter((sub) =>
              !sub.permission || sub.permission.trim().length === 0
                ? false
                : canFunction(sub.permission),
            );

            const keepParent = parentAllowed || filteredSubitems.length > 0;
            if (!keepParent) return;

            return {
              ...item,
              subitems: filteredSubitems,
            };
          }

          return parentAllowed ? item : undefined;
        })
        .filter((index): index is NonNullable<typeof index> => index !== undefined);

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);
};
