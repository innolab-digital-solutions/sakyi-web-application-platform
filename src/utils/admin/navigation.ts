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
        item.subitems?.some((sub) => currentPath === sub.path) ||
        false,
      subitems: item.subitems?.map((sub) => ({
        ...sub,
        active: currentPath === sub.path,
      })),
    })),
  }));
};
