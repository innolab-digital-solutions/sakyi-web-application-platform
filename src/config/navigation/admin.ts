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

import { PATHS } from "@/config/paths";
import { NavGroup } from "@/types/shared/navigation";

/**
 * Admin sidebar navigation configuration
 * Defines the sidebar navigation structure for all admin routes.
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
            path: PATHS.ADMIN.WORKOUT_CATEGORIES.LIST,
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
    ],
  },
];
