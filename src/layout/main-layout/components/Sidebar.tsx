import { cn } from "@/lib/utils";
import { Cloud, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLayoutStore } from "../store/layoutStore";
import {
  sidebarFooterItems,
  sidebarNavGroups,
  type NavItem,
} from "./sidebar-nav-config";
import "./Sidebar.scss";

function SidebarNavLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn("sidebar__link", isActive && "sidebar__link--active")
      }
      title={item.label}
    >
      <span className="sidebar__link-icon-wrap">
        <item.icon className="sidebar__link-icon" aria-hidden />
        {item.hasNotification && (
          <span
            className="sidebar__notification-dot"
            aria-label="New updates"
          />
        )}
      </span>
      <span className="sidebar__link-label">{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const {
    isSidebarPinned,
    isSidebarPinClosing,
    isSidebarHovered,
    setSidebarHovered,
  } = useLayoutStore();
  const isExpanded = isSidebarPinned || isSidebarHovered || isSidebarPinClosing;
  const isHoverOverlay = isSidebarHovered && !isSidebarPinned;

  return (
    <aside
      className={cn(
        "sidebar",
        isSidebarPinned && "sidebar--pinned",
        isSidebarPinClosing && "sidebar--pin-closing",
        isHoverOverlay && "sidebar--hover",
        isExpanded && "sidebar--expanded"
      )}
      aria-label="Main navigation"
    >
      <div
        className="sidebar__panel"
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="sidebar__inner">
          <div className="sidebar__brand">
            <Cloud className="sidebar__brand-icon" aria-hidden />
            <span className="sidebar__brand-text">Lease Catalyst</span>
          </div>

          {/* <button type="button" className="sidebar__create-btn">
            <Plus className="size-5 shrink-0" aria-hidden />
            <span className="sidebar__create-label">Create New +</span>
          </button> */}

          <nav className="sidebar__nav">
            {sidebarNavGroups.map((group) => (
              <div
                key={group.title ?? group.items[0]?.path}
                className="sidebar__group"
              >
                {group.title && (
                  <div className="sidebar__group-title">{group.title}</div>
                )}
                {group.items.map((item) => (
                  <SidebarNavLink key={item.path} item={item} />
                ))}
              </div>
            ))}
          </nav>

          {/* <div className="sidebar__footer">
            {sidebarFooterItems.map((item) => (
              <SidebarNavLink key={item.path} item={item} />
            ))}
          </div> */}
        </div>
      </div>
    </aside>
  );
}
