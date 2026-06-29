import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Blocks,
  Building2,
  Calculator,
  Calendar,
  ClipboardList,
  Cloud,
  FileText,
  Languages,
  LayoutDashboard,
  PlayCircle,
  ShieldCogCorner,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  hasNotification?: boolean;
};

export type NavGroup = {
  title?: string;
  items: NavItem[];
};

export const superAdminMenu: NavGroup[] = [
  {
    items: [
      { label: "Companies", path: "/company", icon: Building2 },
      { label: "Subscriptions", path: "/subscriptions", icon: ShieldCogCorner },
    ],
  },
];

export const sidebarNavGroups: NavGroup[] = [
  {
    items: [
      { label: "Job Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    items: [{ label: "Users", path: "/users", icon: Users }],
  },
  {
    title: "Property Operations",
    items: [
      { label: "Projects", path: "/projects", icon: Building2 },
      {
        label: "Data Category",
        path: "/data-category",
        icon: FileText,
        hasNotification: false,
      },
      { label: "Events", path: "/events", icon: Calendar },
      { label: "Reporting Dashboard", path: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Financials",
    items: [
      { label: "Portfolio Reporting", path: "/expenses", icon: Calculator },
      {
        label: "CAM / OPEX Reconcilation",
        path: "/owner-financials",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Translation Services",
    items: [
      { label: "Translation", path: "/lease-translate", icon: Languages },
    ],
  },
  {
    title: "Integrations",
    items: [{ label: "App Integrations", path: "/integrations", icon: Blocks }],
  },
];

export const sidebarFooterItems: NavItem[] = [
  { label: "Downloads", path: "/downloads", icon: Cloud },
];

export const sidebarQuickActions: NavItem[] = [
  { label: "Quick action", path: "/quick-action", icon: PlayCircle },
];
