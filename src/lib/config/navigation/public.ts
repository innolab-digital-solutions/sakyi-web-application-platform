import { PATHS } from "@/lib/config/paths";

import { NavItem } from "./types";

/**
 * Public navigation configuration
 *
 * @returns The public navigation
 */
export const publicNavigation: NavItem[] = [
  {
    name: "Home",
    path: PATHS.PUBLIC.HOME,
    active: false,
  },
];

/**
 * Footer navigation configuration
 *
 * @returns The footer navigation
 */
export const footerNavigation = {
  company: [
    { name: "About", path: "" },
    { name: "Contact", path: "" },
    { name: "Privacy", path: "" },
    { name: "Terms", path: "" },
  ],
};

/**
 * Get the active public navigation
 *
 * @param currentPath - The current path
 * @param navigation - The navigation
 * @returns The active public navigation
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
