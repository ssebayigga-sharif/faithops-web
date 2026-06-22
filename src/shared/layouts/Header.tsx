import { useState, useCallback, useRef, type KeyboardEvent } from "react";
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
} from "@carbon/icons-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { headerNavigationItems } from "@/shared/data/navigation";
import ChurchIcon from "./ChurchIcon";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import type { ChurchRole } from "@/features/auth/types";

const ADMIN_ROLES: ChurchRole[] = ["pastor", "elder", "deacon", "treasurer"];

const MEMBER_HEADER_PATHS = ["/dashboard", "/home", "/about"];

type HeaderProps = {
  isSideNavExpanded: boolean;
  onMenuClick: () => void;
};

const Header = ({ isSideNavExpanded, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuthContext();
  const role = userProfile?.role ?? "member";
  const isAdmin = ADMIN_ROLES.includes(role);
  const { unreadCount, notifications, markRead, refresh } = useNotifications();
  const [searchValue, setSearchValue] = useState("");
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Search ──────────────────────────────────────────────────────────

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

  // ── Notifications panel toggle

  const toggleNotifPanel = useCallback(() => {
    setNotifPanelOpen((prev) => !prev);
    if (!notifPanelOpen) refresh();
  }, [notifPanelOpen, refresh]);

  // ── Logout

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

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
        {headerNavigationItems
          .filter((item) => isAdmin || MEMBER_HEADER_PATHS.includes(item.path))
          .map((item) => (
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
          aria-label="User profile"
          onClick={() => navigate("/profile")}
        >
          <UserAvatar size={20} />
        </HeaderGlobalAction>

        {user && (
          <HeaderGlobalAction
            tooltipAlignment="end"
            aria-label="Sign out"
            onClick={handleLogout}
            className="app-header__logout"
          >
            <span className="app-header__logout-icon">Sign out</span>
          </HeaderGlobalAction>
        )}
      </HeaderGlobalBar>

      {/* Notifications slide-over panel */}
      {notifPanelOpen && (
        <HeaderPanel aria-label="Notifications panel">
          <div className="app-header__notif-header">
            <strong>Notifications</strong>
            {notifications.length === 0 && (
              <span className="app-header__notif-empty">No notifications</span>
            )}
          </div>
          <SwitcherDivider />
          <ul className="app-header__notif-list">
            {notifications.slice(0, 20).map((n) => (
              <li
                key={n.id}
                className={`app-header__notif-item ${!n.read ? "is-unread" : ""}`}
                onClick={() => !n.read && markRead(n.id)}
              >
                <span className="app-header__notif-title">{n.title}</span>
                <p className="app-header__notif-body">{n.body}</p>
                <small className="app-header__notif-time">
                  {new Date(n.createdAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        </HeaderPanel>
      )}
    </CarbonHeader>
  );
};

export default Header;
