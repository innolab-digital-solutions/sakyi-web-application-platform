import {
  Activity,
  BarChart3,
  BookOpen,
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
        permission: "teams.view",
        subitems: [],
      },
      {
        name: "Roles & Permissions",
        icon: ShieldCheck,
        path: PATHS.ADMIN.ROLES.LIST,
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
        path: PATHS.ADMIN.PROGRAMS.LIST,
        params: {},
        active: false,
        permission: "programs.view",
        subitems: [],
      },
      {
        name: "Appointments",
        icon: CalendarClock,
        path: "/admin/schedule",
        params: {},
        active: false,
        permission: "appointments.view",
        subitems: [],
      },
      {
        name: "Enrollments",
        icon: ClipboardCheck,
        path: "/admin/enrollments",
        params: {},
        active: false,
        permission: "enrollments.view",
        subitems: [],
      },
      {
        name: "Clients",
        icon: Users,
        path: "/admin/users",
        params: {},
        active: false,
        permission: "clients.view",
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
        permission: "plans.view",
        subitems: [],
      },
      {
        name: "Onboarding",
        icon: ListChecks,
        path: "#",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Forms",
            path: PATHS.ADMIN.ONBOARDING_FORMS.LIST,
            params: {},
            active: false,
            permission: "onboarding.forms.view",
          },
          {
            name: "Submissions",
            path: "/admin/onboarding/responses",
            params: {},
            active: false,
            permission: "onboarding.submissions.view",
          },
        ],
      },
      {
        name: "Health Data",
        icon: Activity,
        path: "#",
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
        path: "#",
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
            permission: "food.categories.view",
          },
          {
            name: "Food Items",
            path: PATHS.ADMIN.FOOD_ITEMS.LIST,
            params: {},
            active: false,
            permission: "food.items.view",
          },
        ],
      },
      {
        name: "Workout Library",
        icon: BarChart3,
        path: "#",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Workout Categories",
            path: PATHS.ADMIN.WORKOUT_CATEGORIES.LIST,
            params: {},
            active: false,
            permission: "workout.categories.view",
          },
          {
            name: "Workout Items",
            path: "/admin/workouts",
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
        path: "/admin/payment-methods",
        params: {},
        active: false,
        permission: "payment-methods.view",
        subitems: [],
      },
      {
        name: "Invoices",
        icon: Receipt,
        path: "/admin/payments/invoices",
        params: {},
        active: false,
        permission: "invoices.view",
        subitems: [],
      },
    ],
  },

  {
    title: "Content Management",
    items: [
      {
        name: "Blog",
        icon: BookOpen,
        path: "#",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Blog Categories",
            path: PATHS.ADMIN.BLOG_CATEGORIES.LIST,
            params: {},
            active: false,
            permission: "blog.categories.view",
          },
          {
            name: "Blog Posts",
            path: PATHS.ADMIN.BLOG_POSTS.LIST,
            params: {},
            active: false,
            permission: "blog.posts.view",
          },
        ],
      },
    ],
  },

  {
    title: "System & Settings",
    items: [
      {
        name: "Monitoring",
        icon: MonitorCog,
        path: "#",
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
        path: "#",
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
