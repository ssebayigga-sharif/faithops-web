import {
  Header as CarbonHeader,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
} from "@carbon/react";
import { Notification, Search, UserAvatar } from "@carbon/icons-react";
import { Link, NavLink } from "react-router-dom";
import {
  brandIcon as BrandIcon,
  headerNavigationItems,
} from "../churchTypes/navigation";

type HeaderProps = {
  isSideNavExpanded: boolean;
  onMenuClick: () => void;
};

const Header = ({ isSideNavExpanded, onMenuClick }: HeaderProps) => (
  <CarbonHeader aria-label="FaithOps church management" className="app-header">
    <HeaderMenuButton
      aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
      isActive={isSideNavExpanded}
      onClick={onMenuClick}
    />
    <Link className="app-header__brand" to="/dashboard">
      <span className="app-header__brand-icon">
        <BrandIcon size={20} />
      </span>

      <small>Kabulengwa Seventh-Day Adventists Church</small>
    </Link>

    <div className="app-header__search" role="search">
      <Search size={18} />
      <input
        aria-label="Search FaithOps"
        placeholder="Search members, events..."
      />
    </div>

    <nav className="app-header__nav" aria-label="Header navigation">
      {headerNavigationItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            isActive ? "app-header__nav-link is-active" : "app-header__nav-link"
          }
          key={item.path}
          to={item.path}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>

    <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="Notifications">
        <Notification size={20} />
      </HeaderGlobalAction>
      <HeaderGlobalAction aria-label="User profile">
        <UserAvatar size={20} />
      </HeaderGlobalAction>
    </HeaderGlobalBar>
  </CarbonHeader>
);

export default Header;
