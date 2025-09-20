import {
  Activity,
  BarChart3,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Database,
  FileBarChart,
  FileClock,
  FileText,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  MonitorCog,
  Receipt,
  Settings,
  ShieldCheck,
  Stethoscope,
  Store,
  UserCog,
  Users,
} from "lucide-react";

import { PATHS } from "@/lib/config/paths";

import { NavGroup } from "./types";

/**
 * Admin sidebar navigation configuration
 *
 * @returns The admin sidebar navigation
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
        allow: true,
        subitems: [],
      },
      {
        name: "Analytics",
        icon: FileBarChart,
        path: "/admin/analytics",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "User Growth",
            path: "/admin/analytics/users",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Program Engagement",
            path: "/admin/analytics/programs",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Daily Activity",
            path: "/admin/analytics/activity",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Program Completion",
            path: "/admin/analytics/completion",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "System Logs",
            path: "/admin/analytics/system",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
      {
        name: "Reports",
        icon: FileText,
        path: "/admin/reports",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "Enrollment Reports",
            path: "/admin/reports/enrollment",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Financial Reports",
            path: "/admin/reports/finance",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Program Outcome Reports",
            path: "/admin/reports/outcomes",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
      {
        name: "Audit Logs",
        icon: FileClock,
        path: "/admin/audit-logs",
        params: {},
        active: false,
        allow: true,
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
        allow: true,
        subitems: [],
      },
      {
        name: "Staff Accounts",
        icon: UserCog,
        path: "/admin/staff",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Roles & Permissions",
        icon: ShieldCheck,
        path: "/admin/roles",
        params: {},
        active: false,
        allow: true,
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
        allow: true,
        subitems: [],
      },
      {
        name: "Appointments",
        icon: CalendarClock,
        path: "/admin/schedule",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Enrollments",
        icon: ClipboardCheck,
        path: "/admin/enrollments",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Clients",
        icon: Users,
        path: "/admin/users",
        params: {},
        active: false,
        allow: true,
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
        allow: true,
        subitems: [],
      },
      {
        name: "Onboarding",
        icon: ListChecks,
        path: "/admin/onboarding",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "Forms",
            path: "/admin/onboarding/forms",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Questions",
            path: "/admin/onboarding/questions",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Responses",
            path: "/admin/onboarding/responses",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
      {
        name: "Health Data",
        icon: Activity,
        path: "/admin/health-data",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "Sleep Tracking",
            path: "/admin/health-data/sleep",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Meal Logs",
            path: "/admin/health-data/meals",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Workout Logs",
            path: "/admin/health-data/workouts",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
      {
        name: "Food & Nutrition",
        icon: Stethoscope,
        path: "/admin/nutrition",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "Units",
            path: "/admin/nutrition/units",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Food Categories",
            path: "/admin/nutrition/categories",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Food Items",
            path: "/admin/nutrition/items",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
      {
        name: "Workout Library",
        icon: BarChart3,
        path: "/admin/workouts",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "Workout Categories",
            path: "/admin/workouts/categories",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Workout Items",
            path: "/admin/workouts/items",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
    ],
  },

  {
    title: "Content & Community",
    items: [
      {
        name: "News Feed",
        icon: MessageSquare,
        path: "/admin/news-feed",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Marketplace",
        icon: Store,
        path: "/admin/marketplace",
        params: {},
        active: false,
        allow: true,
        subitems: [],
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
        allow: true,
        subitems: [],
      },
      {
        name: "Invoices",
        icon: Receipt,
        path: "/admin/payments/invoices",
        params: {},
        active: false,
        allow: true,
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
        allow: true,
        subitems: [
          {
            name: "Health",
            path: "/pulse",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Queue",
            path: "/horizon",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Debugger",
            path: "/telescope",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
      {
        name: "Platform Settings",
        icon: Settings,
        path: "/admin/settings",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "General",
            path: "/admin/settings/general",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "SEO",
            path: "/admin/settings/seo",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Integrations",
            path: "/admin/settings/integrations",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
      {
        name: "Data Management",
        icon: Database,
        path: "/admin/data",
        params: {},
        active: false,
        allow: true,
        subitems: [
          {
            name: "Backups",
            path: "/admin/data/backups",
            params: {},
            active: false,
            allow: true,
          },
          {
            name: "Imports/Exports",
            path: "/admin/data/io",
            params: {},
            active: false,
            allow: true,
          },
        ],
      },
    ],
  },
];

/**
 * Get the active admin navigation
 *
 * @param currentPath - The current path
 * @param navigation - The navigation
 * @returns The active admin navigation
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
