import {
  Activity,
  BarChart3,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  MonitorCog,
  Receipt,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Users,
} from "lucide-react";

import { PATHS } from "@/config/paths";
import { NavGroup } from "@/types/shared/navigation";

/**
 * Admin sidebar navigation configuration
 *
 * Defines the navigation structure for the admin dashboard sidebar.
 * Organized into logical groups with icons, paths, and permission requirements.
 *
 * Properties:
 * - **name**: Display text for navigation item
 * - **icon**: Lucide icon component
 * - **path**: Route path (use PATHS constants)
 * - **permission**: Required permission string (empty = always visible)
 * - **params**: Reserved for future use (filtering, etc.)
 * - **active**: Managed at runtime by navigation utilities
 * - **subitems**: Nested navigation items
 *
 * Note: Active states and runtime params are managed by
 * `getActiveAdminNav()` utility, not defined here.
 */
export const adminNavigation: NavGroup[] = [
  {
    title: "Dashboard & Insights",
    items: [
      {
        name: "Overview",
        icon: LayoutDashboard,
        path: PATHS.ADMIN.OVERVIEW,
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
    ],
  },

  {
    title: "Administration & Access Control",
    items: [
      {
        name: "Team Management",
        icon: Users,
        path: "/admin/team-management",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
      {
        name: "Staff Accounts",
        icon: UserCog,
        path: "/admin/staff",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
      {
        name: "Roles & Permissions",
        icon: ShieldCheck,
        path: "/admin/roles",
        params: {},
        active: false,
        permission: "roles.view",
        subitems: [],
      },
    ],
  },

  {
    title: "Programs & Clients",
    items: [
      {
        name: "Program Management",
        icon: ClipboardList,
        path: "/admin/programs",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
      {
        name: "Appointments",
        icon: CalendarClock,
        path: "/admin/schedule",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
      {
        name: "Enrollments",
        icon: ClipboardCheck,
        path: "/admin/enrollments",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
      {
        name: "Clients",
        icon: Users,
        path: "/admin/users",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
    ],
  },

  {
    title: "Health Data & Plans",
    items: [
      {
        name: "Doctor Plans",
        icon: BookOpenCheck,
        path: "/admin/plans",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
      {
        name: "Onboarding",
        icon: ListChecks,
        path: "/admin/onboarding",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Forms",
            path: "/admin/onboarding/forms",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "Questions",
            path: "/admin/onboarding/questions",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "Responses",
            path: "/admin/onboarding/responses",
            params: {},
            active: false,
            permission: "",
          },
        ],
      },
      {
        name: "Health Data",
        icon: Activity,
        path: "/admin/health-data",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Sleep Tracking",
            path: "/admin/health-data/sleep",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "Meal Logs",
            path: "/admin/health-data/meals",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "Workout Logs",
            path: "/admin/health-data/workouts",
            params: {},
            active: false,
            permission: "",
          },
        ],
      },
      {
        name: "Food & Nutrition",
        icon: Stethoscope,
        path: "/admin/nutrition",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Units",
            path: PATHS.ADMIN.UNITS.LIST,
            params: {},
            active: false,
            permission: "units.view",
          },
          {
            name: "Food Categories",
            path: PATHS.ADMIN.FOOD_CATEGORIES.LIST,
            params: {},
            active: false,
            permission: "food-categories.view",
          },
          {
            name: "Food Items",
            path: "/admin/nutrition/items",
            params: {},
            active: false,
            permission: "",
          },
        ],
      },
      {
        name: "Workout Library",
        icon: BarChart3,
        path: "/admin/workouts",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Workout Categories",
            path: PATHS.ADMIN.WORKOUT_CATEGORIES.LIST,
            params: {},
            active: false,
            permission: "workout-categories.view",
          },
          {
            name: "Workout Items",
            path: PATHS.ADMIN.WORKOUTS.LIST,
            params: {},
            active: false,
            permission: "workouts.view",
          },
        ],
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        name: "Payment Methods",
        icon: CreditCard,
        path: "/admin/payments/methods",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
      {
        name: "Invoices",
        icon: Receipt,
        path: "/admin/payments/invoices",
        params: {},
        active: false,
        permission: "",
        subitems: [],
      },
    ],
  },

  {
    title: "System & Settings",
    items: [
      {
        name: "Monitoring",
        icon: MonitorCog,
        path: "/admin/system",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Health",
            path: "/pulse",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "Queue",
            path: "/horizon",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "Debugger",
            path: "/telescope",
            params: {},
            active: false,
            permission: "",
          },
        ],
      },
      {
        name: "Platform Settings",
        icon: Settings,
        path: "/admin/settings",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "General",
            path: "/admin/settings/general",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "SEO",
            path: "/admin/settings/seo",
            params: {},
            active: false,
            permission: "",
          },
          {
            name: "Integrations",
            path: "/admin/settings/integrations",
            params: {},
            active: false,
            permission: "",
          },
        ],
      },
    ],
  },
];
