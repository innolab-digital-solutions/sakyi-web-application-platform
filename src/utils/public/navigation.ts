import { NavItem } from "@/types/shared/navigation";

/**
 * Sets active states on public navigation items
 *
 * Marks navigation items as active based on current route path.
 * Parent items are marked active if any subitem matches.
 *
 * @param currentPath - Current route pathname
 * @param navigation - Public navigation items with nested structure
 * @returns Navigation with active states updated
 */
export const getActivePublicNav = (currentPath: string, navigation: NavItem[]): NavItem[] => {
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
