import {
  LayoutDashboard,
  FileBarChart,
  FileClock,
  MonitorCog,
  UserCog,
  Users,
  ShieldCheck,
  Store,
  MessageSquare,
  LucideIcon,
  HeartPulse,
  ClipboardList,
  FileText,
  BookOpenCheck,
  CalendarClock,
} from "lucide-react";

export interface SubItem {
  name: string;
  path: string;
  params: Record<string, string>;
  active: boolean;
  allow: boolean;
}

export interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
  params: Record<string, string>;
  active: boolean;
  allow: boolean;
  subitems: SubItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const adminNavigation: NavGroup[] = [
  {
    title: "Dashboard & System",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/overview",
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
            name: "Daily Activity Stats",
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
        name: "Audit Logs",
        icon: FileClock,
        path: "/admin/audit-logs",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "System Monitoring",
        icon: MonitorCog,
        path: "#",
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
    ],
  },

  {
    title: "Client & Program",
    items: [
      {
        name: "Clients",
        icon: UserCog,
        path: "/admin/clients",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Programs",
        icon: ClipboardList,
        path: "/admin/programs",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Weekly Instructions",
        icon: FileText,
        path: "/admin/instructions",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Reports & Reviews",
        icon: BookOpenCheck,
        path: "/admin/reports",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
      {
        name: "Schedules & Meetings",
        icon: CalendarClock,
        path: "/admin/schedule",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
    ],
  },

  {
    title: "Content & Engagement",
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
    title: "Team & Access Control",
    items: [
      {
        name: "Admin Users",
        icon: Users,
        path: "/admin/team",
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
    title: "Health & Tracking Tools",
    items: [
      {
        name: "Live Client Stats",
        icon: HeartPulse,
        path: "/admin/stats",
        params: {},
        active: false,
        allow: true,
        subitems: [],
      },
    ],
  },
];
