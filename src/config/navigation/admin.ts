import {
  Activity,
  Apple,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  CreditCard,
  Dumbbell,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Scale,
  ShieldCheck,
  UserCog,
  Users,
  UserSquare2,
} from "lucide-react";

import { PATHS } from "@/config/paths";
import { NavGroup } from "@/types/shared/navigation";

export const adminNavigation: NavGroup[] = [
  /* -------------------------------------------------------------------------- */
  /* Dashboard & Insights                                                           */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /* Access & Organization                                                       */
  /* -------------------------------------------------------------------------- */
  {
    title: "Access & Organization",
    items: [
      {
        name: "Roles & Permissions",
        icon: ShieldCheck,
        path: PATHS.ADMIN.ROLES.LIST,
        params: {},
        active: false,
        permission: "roles.view",
        subitems: [],
      },
      {
        name: "Accounts",
        icon: UserCog,
        path: PATHS.ADMIN.USERS.LIST,
        params: {},
        active: false,
        permission: "users.view",
        subitems: [],
      },
      {
        name: "Teams",
        icon: Users,
        path: PATHS.ADMIN.TEAMS.LIST,
        params: {},
        active: false,
        permission: "teams.view",
        subitems: [],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Client Care & Services                                                  */
  /* -------------------------------------------------------------------------- */
  {
    title: "Client Care & Services",
    items: [
      {
        name: "Programs",
        icon: FolderKanban,
        path: PATHS.ADMIN.PROGRAMS.LIST,
        params: {},
        active: false,
        permission: "programs.view",
        subitems: [],
      },
      {
        name: "Clients",
        icon: UserSquare2,
        path: PATHS.ADMIN.CLIENTS.LIST,
        params: {},
        active: false,
        permission: "clients.view",
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
        name: "Appointments",
        icon: CalendarClock,
        path: "/admin/schedule",
        params: {},
        active: false,
        permission: "appointments.view",
        subitems: [],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Health Planning & Tracking                                                  */
  /* -------------------------------------------------------------------------- */
  {
    title: "Health Planning & Tracking",
    items: [
      {
        name: "Doctor Instructions",
        icon: BookOpenCheck,
        path: PATHS.ADMIN.INSTRUCTIONS.LIST,
        params: {},
        active: false,
        permission: "instructions.view",
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
            name: "Intakes",
            path: "/admin/onboarding/responses",
            params: {},
            active: false,
            permission: "",
          },
        ],
      },
      {
        name: "Health Logs",
        icon: Activity,
        path: "#",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Sleep",
            path: "/admin/health-data/sleep",
            params: {},
            active: false,
            permission: "health.logs.view",
          },
          {
            name: "Meals",
            path: "/admin/health-data/meals",
            params: {},
            active: false,
            permission: "health.logs.view",
          },
          {
            name: "Workouts",
            path: "/admin/health-data/workouts",
            params: {},
            active: false,
            permission: "health.logs.view",
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Nutrition & Training Library                                                  */
  /* -------------------------------------------------------------------------- */
  {
    title: "Nutrition & Training Library",
    items: [
      {
        name: "Measurement Units",
        icon: Scale,
        path: PATHS.ADMIN.UNITS.LIST,
        params: {},
        active: false,
        permission: "units.view",
        subitems: [],
      },
      {
        name: "Nutrition",
        icon: Apple,
        path: "#",
        params: {},
        active: false,
        permission: "",
        subitems: [
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
        name: "Workouts",
        icon: Dumbbell,
        path: "#",
        params: {},
        active: false,
        permission: "",
        subitems: [
          {
            name: "Categories",
            path: PATHS.ADMIN.WORKOUT_CATEGORIES.LIST,
            params: {},
            active: false,
            permission: "workout.categories.view",
          },
          {
            name: "Exercises",
            path: "/admin/workouts",
            params: {},
            active: false,
            permission: "workouts.view",
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Billing & Payments                                                          */
  /* -------------------------------------------------------------------------- */
  {
    title: "Billing & Payments",
    items: [
      {
        name: "Payment Methods",
        icon: CreditCard,
        path: PATHS.ADMIN.PAYMENT_METHODS.LIST,
        params: {},
        active: false,
        permission: "payment.methods.view",
        subitems: [],
      },
      {
        name: "Invoices",
        icon: Receipt,
        path: PATHS.ADMIN.INVOICES.LIST,
        params: {},
        active: false,
        permission: "payment.invoices.view",
        subitems: [],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Content & Engagement                                                  */
  /* -------------------------------------------------------------------------- */
  {
    title: "Content & Engagement",
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
            name: "Categories",
            path: PATHS.ADMIN.BLOG_CATEGORIES.LIST,
            params: {},
            active: false,
            permission: "blog.categories.view",
          },
          {
            name: "Posts",
            path: PATHS.ADMIN.BLOG_POSTS.LIST,
            params: {},
            active: false,
            permission: "blog.posts.view",
          },
        ],
      },
      {
        name: "Testimonials",
        icon: FileText,
        path: "/admin/testimonials",
        params: {},
        active: false,
        permission: "testimonials.view",
        subitems: [],
      },
      {
        name: "Community Posts",
        icon: BarChart3,
        path: "/admin/community-posts",
        params: {},
        active: false,
        permission: "community.posts.view",
        subitems: [],
      },
    ],
  },
];
