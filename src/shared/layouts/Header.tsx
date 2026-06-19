import {
  Header as CarbonHeader,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  Search,
} from "@carbon/react";

import { Notification, UserAvatar } from "@carbon/icons-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { headerNavigationItems } from "@/shared/data/navigation";
import ChurchIcon from "./ChurchIcon";

type HeaderProps = {
  isSideNavExpanded: boolean;
  onMenuClick: () => void;
};

const Header = ({ isSideNavExpanded, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <CarbonHeader
      aria-label="FaithOps church management"
      className="app-header"
    >
      <HeaderMenuButton
        aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
        isActive={isSideNavExpanded}
        onClick={onMenuClick}
      />

      <Link
        aria-label="Go to dashboard"
        className="app-header__brand"
        to="/dashboard"
      >
        <ChurchIcon size={40} />
        <small>Kabulengwa SDA</small>
      </Link>

      {/*
        TODO: search is intentionally non-functional for now.
        When ready, decide: navigate to a results route, or accept an
        onSearch callback from the parent. Don't wire onChange until
        that decision is made — see conversation notes.
      */}
      <Search
        className="app-header__search"
        labelText="Search FaithOps"
        placeholder="Search members, events..."
        size="lg"
      />

      <nav className="app-header__nav" aria-label="Header navigation">
        {headerNavigationItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "app-header__nav-link is-active"
                : "app-header__nav-link"
            }
            key={item.path}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <HeaderGlobalBar>
        <HeaderGlobalAction tooltipAlignment="end" aria-label="Notifications">
          <Notification size={20} />
        </HeaderGlobalAction>

        <HeaderGlobalAction
          tooltipAlignment="end"
          aria-label="User profile"
          onClick={() => navigate("/profile")}
        >
          <UserAvatar size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
};

export default Header;
