import { SideNav, SideNavDivider, SideNavItems } from "@carbon/react";
import { NavLink } from "react-router-dom";
import {
  administrationNavigationItems,
  primaryNavigationItems,
} from "../churchTypes/navigation";

type SidebarProps = {
  isExpanded: boolean;
};

const Sidebar = ({ isExpanded }: SidebarProps) => (
  <SideNav
    aria-label="Primary navigation"
    className="app-sidebar"
    expanded={isExpanded}
    isChildOfHeader={false}
    isFixedNav
  >
    <SideNavItems>
      <div className="app-sidebar__section-label">Workspace</div>
      {primaryNavigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            className={({ isActive }) =>
              isActive ? "app-sidebar__link is-active" : "app-sidebar__link"
            }
            key={item.path}
            title={item.description}
            to={item.path}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
      <SideNavDivider />
      <div className="app-sidebar__section-label">Administration</div>
      {administrationNavigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            className={({ isActive }) =>
              isActive ? "app-sidebar__link is-active" : "app-sidebar__link"
            }
            key={item.path}
            title={item.description}
            to={item.path}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </SideNavItems>
  </SideNav>
);

export default Sidebar;
