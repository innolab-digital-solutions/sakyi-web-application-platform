import { PATHS } from "@/config/paths";
import { NavItem } from "@/types/shared/navigation";

/**
 * Public navigation configuration
 * Defines the sidebar navigation structure for all public routes.
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
 * Defines the footer navigation structure for all public routes.
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
