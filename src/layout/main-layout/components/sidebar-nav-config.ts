import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Blocks,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Calendar,
  ClipboardList,
  Cloud,
  FileText,
  FolderOpen,
  Languages,
  LayoutDashboard,
  PlayCircle,
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

export const sidebarNavGroups: NavGroup[] = [
  {
    items: [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
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
        hasNotification: true,
      },
      { label: "Events", path: "/events", icon: Calendar },
      { label: "Reporting Dashboard", path: "/reports", icon: BarChart3 },
      { label: "Lease Data Validation", path: "/renters", icon: Users },
      { label: "Document Management", path: "/documents", icon: FolderOpen },
    ],
  },
  {
    title: "Financials",
    items: [
      // { label: "Revenues", path: "/revenues", icon: Home },
      { label: "Portfolio Reporting", path: "/expenses", icon: Calculator },
      {
        label: "CAM / OPEX Reconcilation",
        path: "/owner-financials",
        icon: ClipboardList,
      },
      {
        label: "Portfolio Analytics",
        path: "/portfolio",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    title: "Translation Services",
    items: [{ label: "Translate", path: "/lease-translate", icon: Languages }],
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
