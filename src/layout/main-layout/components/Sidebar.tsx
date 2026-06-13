import leaseCatalystLogo2 from "@/assets/logos/lease-catalyst-logo-icon.png";
import leaseCatalystLogoText from "@/assets/logos/lease-text-full-st.png";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useLayoutStore } from "../store/layoutStore";
import { sidebarNavGroups, type NavItem } from "./sidebar-nav-config";
import { superAdminMenu } from "./sidebar-nav-config";
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

  const userRole = localStorage.getItem("user_role") || "";

  const NavMenu =
    userRole === "super-admin" ? superAdminMenu : sidebarNavGroups;

  return (
    <aside
      className={cn(
        "sidebar",
        isSidebarPinned && "sidebar--pinned",
        isSidebarPinClosing && "sidebar--pin-closing",
        isHoverOverlay && "sidebar--hover",
        isExpanded && "sidebar--expanded",
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
            <img
              src={leaseCatalystLogo2}
              alt="Lease Catalyst"
              className="sidebar__brand-icon"
            />
            <img
              src={leaseCatalystLogoText}
              alt=""
              className="sidebar__brand-text"
              aria-hidden
            />
          </div>

          <nav className="sidebar__nav">
            {NavMenu.map((group) => (
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
        </div>
      </div>
    </aside>
  );
}
