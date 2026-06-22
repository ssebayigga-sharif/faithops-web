import { SideNav, SideNavDivider, SideNavItems } from "@carbon/react";
import { NavLink } from "react-router-dom";
import {
  administrationNavigationItems,
  primaryNavigationItems,
} from "@/shared/data/navigation";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import type { ChurchRole } from "@/features/auth/types";

const ADMIN_ROLES: ChurchRole[] = ["pastor", "elder", "deacon", "treasurer"];

const MEMBER_NAV_PATHS = [
  "/dashboard",
  "/home",
  "/about",
  "/giving",
  "/profile",
];

type SidebarProps = {
  isExpanded: boolean;
  isMobileNav: boolean;
  onRequestClose: () => void;
};

const Sidebar = ({ isExpanded, isMobileNav, onRequestClose }: SidebarProps) => {
  const { userProfile } = useAuthContext();
  const role = userProfile?.role ?? "member";
  const isAdmin = ADMIN_ROLES.includes(role);

  const handleNavClick = () => {
    if (isMobileNav) {
      onRequestClose();
    }
  };

  const filteredPrimary = isAdmin
    ? primaryNavigationItems
    : primaryNavigationItems.filter((item) =>
        MEMBER_NAV_PATHS.includes(item.path),
      );

  return (
    <SideNav
      aria-label="Primary navigation"
      className="app-sidebar"
      expanded={isExpanded}
      isChildOfHeader
      isFixedNav={!isMobileNav}
      onOverlayClick={onRequestClose}
    >
      <SideNavItems>
        <div className="app-sidebar__section-label">Workspace</div>
        {filteredPrimary.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) =>
                isActive ? "app-sidebar__link is-active" : "app-sidebar__link"
              }
              key={item.path}
              title={item.description}
              to={item.path}
              onClick={handleNavClick}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Administration section - only for admin roles */}
        {isAdmin && (
          <>
            <SideNavDivider />
            <div className="app-sidebar__section-label">Administration</div>
            {administrationNavigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "app-sidebar__link is-active"
                      : "app-sidebar__link"
                  }
                  key={item.path}
                  title={item.description}
                  to={item.path}
                  onClick={handleNavClick}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </>
        )}
      </SideNavItems>
    </SideNav>
  );
};

export default Sidebar;
