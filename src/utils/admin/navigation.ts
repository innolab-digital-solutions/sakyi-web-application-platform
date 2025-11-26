import { NavGroup } from "@/types/shared/navigation";

/**
 * Checks if path is an admin list/table page
 *
 * Identifies pages that should have default pagination/sorting parameters
 * in their URLs (e.g., page=1&per_page=10&sort=id&direction=desc).
 *
 * @param path - Path to check
 * @returns True if path is an admin list page
 */
export const isAdminListPage = (path: string): boolean => {
  const listPagePatterns = [
    /\/admin\/workout-categories$/,
    /\/admin\/food-categories$/,
    /\/admin\/units$/,
    /\/admin\/roles$/,
    /\/admin\/users$/,
    /\/admin\/teams$/,
    /\/admin\/staff$/,
    /\/admin\/programs$/,
    /\/admin\/enrollments$/,
    /\/admin\/onboarding\/forms$/,
    /\/admin\/payment-methods$/,
    /\/admin\/workouts$/,
    /\/admin\/food-items$/,
    /\/admin\/blog-categories$/,
    /\/admin\/blog-posts$/,
    /\/admin\/testimonials$/,
  ];

  return listPagePatterns.some((pattern) => pattern.test(path));
};

/**
 * Sets active states on admin navigation items
 *
 * Marks navigation items as active based on current route path.
 * Handles both top-level items and nested subitems, with parent
 * items marked active if any subitem matches.
 *
 * @param currentPath - Current route pathname
 * @param navigation - Navigation groups with menu structure
 * @returns Navigation with active states updated
 */
export const getActiveAdminNav = (currentPath: string, navigation: NavGroup[]): NavGroup[] => {
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
 * Filters navigation by user permissions
 *
 * Removes navigation items the user doesn't have access to. Special handling:
 * - `/admin/overview` is always accessible (default landing page)
 * - Empty permissions are treated as unconfigured and hidden
 * - Parents with subitems are kept if they're allowed OR have any allowed subitems
 * - Empty groups are removed
 *
 * @param navigation - Full navigation configuration
 * @param canFunction - Permission check function (returns true if allowed)
 * @returns Filtered navigation containing only accessible items
 */
export const filterNavByPermission = (
  navigation: NavGroup[],
  canFunction: (permission: string) => boolean,
): NavGroup[] => {
  return navigation
    .map((group) => {
      const filteredItems = group.items
        .map((item) => {
          const isOverviewPage = item.path === "/admin/overview";

          // Check parent permission
          const parentAllowed = isOverviewPage
            ? true
            : !item.permission || item.permission.trim().length === 0
              ? false
              : canFunction(item.permission);

          // Handle items with subitems
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
