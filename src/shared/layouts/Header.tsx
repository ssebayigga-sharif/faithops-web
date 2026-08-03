import React, {
  useState,
  useCallback,
  useRef,
  type KeyboardEvent,
} from "react";
import {
  Header as CarbonHeader,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  Search,
  HeaderPanel,
  SwitcherDivider,
} from "@carbon/react";

import {
  Notification,
  NotificationFilled,
  UserAvatar,
  Logout,
  SendAlt,
} from "@carbon/icons-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { headerNavigationItems } from "../data/navigation";
import ChurchIcon from "./ChurchIcon";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { HeaderNotifications } from "./HeaderNotifications";

type HeaderProps = {
  isSideNavExpanded: boolean;
  onMenuClick: () => void;
};

const Header = ({ isSideNavExpanded, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const activeUid = user?.uid ?? "";
  const { unreadCount, markAllRead } = useNotifications(activeUid);
  const [searchValue, setSearchValue] = useState("");
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //  Search

  const handleSearchChange = useCallback(
    (e: { target: { value: string } }) => {
      const value = e.target.value;
      setSearchValue(value);

      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          navigate(`/search?q=${encodeURIComponent(value.trim())}`);
        }
      }, 400); // debounce
    },
    [navigate],
  );

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchValue.trim()) {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      }
    },
    [navigate, searchValue],
  );

  const toggleNotifPanel = useCallback(() => {
    setNotifPanelOpen((prev) => !prev);
  }, []);

  return (
    <CarbonHeader
      aria-label="FaithOps church management"
      className="app-header"
    >
      <HeaderMenuButton
        aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
        isActive={isSideNavExpanded}
        onClick={onMenuClick}
        className="app-header__menu-toggle"
      />

      <Link
        aria-label="Go to dashboard"
        className="app-header__brand"
        to="/dashboard"
      >
        <ChurchIcon size={40} />
        <small>Kabulengwa SDA</small>
      </Link>

      <Search
        className="app-header__search"
        labelText="Search FaithOps"
        placeholder="Search members, events..."
        size="lg"
        value={searchValue}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
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
        <HeaderGlobalAction
          tooltipAlignment="end"
          aria-label="Messages"
          onClick={() => navigate("/messages")}
        >
          <SendAlt size={20} />
        </HeaderGlobalAction>

        <HeaderGlobalAction
          tooltipAlignment="end"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "Notifications"
          }
          onClick={toggleNotifPanel}
          isActive={notifPanelOpen}
        >
          {unreadCount > 0 ? (
            <>
              <NotificationFilled size={20} />
              <span className="app-header__notif-badge">{unreadCount}</span>
            </>
          ) : (
            <Notification size={20} />
          )}
        </HeaderGlobalAction>

        <HeaderGlobalAction
          tooltipAlignment="end"
          aria-label={user?.displayName || "User profile"}
          onClick={() => navigate("/profile")}
        >
          <UserAvatar size={20} />
        </HeaderGlobalAction>

        {user && (
          <HeaderGlobalAction
            tooltipAlignment="end"
            aria-label="Sign out"
            onClick={() => logout()}
          >
            <Logout size={20} />
          </HeaderGlobalAction>
        )}
      </HeaderGlobalBar>

      {notifPanelOpen && (
        <HeaderNotifications
          open={notifPanelOpen}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
        />
      )}
    </CarbonHeader>
  );
};

export default Header;
