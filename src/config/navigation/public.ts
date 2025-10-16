import { PATHS } from "@/config/paths";
import { NavItem } from "@/types/shared/navigation";

/**
 * Public website navigation configuration
 *
 * Defines navigation structure for public-facing pages.
 * Active states are managed at runtime by `getActivePublicNav()` utility.
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
 * Links displayed in the website footer, organized by category.
 */
export const footerNavigation = {
  company: [
    { name: "About", path: "" },
    { name: "Contact", path: "" },
    { name: "Privacy", path: "" },
    { name: "Terms", path: "" },
  ],
};
