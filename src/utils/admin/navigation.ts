import { NavGroup } from "@/types/shared/navigation";

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
 * Items with an empty or missing `permission` are considered allowed.
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
          const parentAllowed =
            typeof item.permission === "string"
              ? item.permission.trim().length > 0 && canFunction(item.permission)
              : true;

          if (item.subitems && item.subitems.length > 0) {
            const filteredSubitems = item.subitems.filter((sub) =>
              typeof sub.permission === "string"
                ? sub.permission.trim().length > 0 && canFunction(sub.permission)
                : true,
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
