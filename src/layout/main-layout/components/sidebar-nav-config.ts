import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Calculator,
  ClipboardList,
  Cloud,
  FileText,
  FolderOpen,
  Home,
  PlayCircle,
  Search,
  UserCircle,
  Users,
  Wrench,
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
    items: [{ label: "Dashboard", path: "/dashboard", icon: BarChart3 }],
  },
  {
    title: "Property Operations",
    items: [
      { label: "Portfolio", path: "/portfolio", icon: Building2 },
      {
        label: "Listings & Applications",
        path: "/listings",
        icon: FileText,
        hasNotification: true,
      },
      { label: "Renters", path: "/renters", icon: Users },
    ],
  },
  {
    title: "Financials",
    items: [
      { label: "Revenues", path: "/revenues", icon: Home },
      { label: "Expenses", path: "/expenses", icon: Calculator },
      {
        label: "Owner Financials",
        path: "/owner-financials",
        icon: UserCircle,
      },
      { label: "Reconciliation", path: "/reconciliation", icon: ClipboardList },
      { label: "Reports", path: "/reports", icon: BarChart3 },
    ],
  },
  // {
  //   title: "Property Services",
  //   items: [
  //     { label: "Documents", path: "/documents", icon: FolderOpen },
  //     {
  //       label: "Maintenance",
  //       path: "/maintenance",
  //       icon: Wrench,
  //       hasNotification: true,
  //     },
  //     { label: "Inspections", path: "/inspections", icon: Search },
  //   ],
  // },
];

export const sidebarFooterItems: NavItem[] = [
  { label: "Downloads", path: "/downloads", icon: Cloud },
];

export const sidebarQuickActions: NavItem[] = [
  { label: "Quick action", path: "/quick-action", icon: PlayCircle },
];
