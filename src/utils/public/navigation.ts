import { NavItem } from "@/types/shared/navigation";

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
