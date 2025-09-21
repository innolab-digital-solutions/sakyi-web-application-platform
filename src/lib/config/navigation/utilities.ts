import { NavGroup } from "./types";
import { NavItem } from "./types";

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

/**
 * Get the active public navigation
 *
 * @param currentPath - The current route pathname to match against navigation items
 * @param navigation - Array of public navigation items and their nested structure
 * @returns Updated navigation items with active states properly configured
 */
export const getActivePublicNav = (currentPath: string, navigation: NavItem[]) => {
  return navigation.map((item) => ({
    ...item,
    active:
      currentPath === item.path || item.subitems?.some((sub) => currentPath === sub.path) || false,
    subitems: item.subitems?.map((sub) => ({
      ...sub,
      active: currentPath === sub.path,
    })),
  }));
};
