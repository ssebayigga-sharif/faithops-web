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
  Send,
  ReplyAll,
  SendAlt,
} from "@carbon/icons-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { headerNavigationItems } from "@/shared/data/navigation";
import ChurchIcon from "./ChurchIcon";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useAuth } from "@/features/auth/context/AuthContext";
import { SendMessageModal } from "@/features/notifications/components/SendMessageModal";
import type { ChurchNotification } from "@/features/notifications/types";

type HeaderProps = {
  isSideNavExpanded: boolean;
  onMenuClick: () => void;
};

const Header = ({ isSideNavExpanded, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const activeUid = user?.uid ?? "";
  const { unreadCount, notifications, markRead, markAllRead, refresh } =
    useNotifications(activeUid);
  const [searchValue, setSearchValue] = useState("");
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{
    uid: string;
    name: string;
  } | null>(null);
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

  // ── Notifications panel toggle

  const toggleNotifPanel = useCallback(() => {
    setNotifPanelOpen((prev) => !prev);
    if (!notifPanelOpen) refresh();
  }, [notifPanelOpen, refresh]);

  // ── Reply to a message notification

  const handleReply = useCallback((notification: ChurchNotification) => {
    setReplyTarget({
      uid: notification.senderUid,
      name: notification.senderName,
    });
    setMsgModalOpen(true);
  }, []);

  const handleCloseMsgModal = useCallback(() => {
    setMsgModalOpen(false);
    setReplyTarget(null);
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

      {/* Notifications slide-over panel */}
      {notifPanelOpen && (
        <HeaderPanel aria-label="Notifications panel">
          <div className="app-header__notif-header">
            <strong>Notifications</strong>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                className="app-header__notif-mark-read"
                onClick={markAllRead}
                type="button"
              >
                <ReplyAll size={16} />
                <span>Mark all read</span>
              </button>
            )}
          </div>
          <SwitcherDivider />
          {notifications.length === 0 ? (
            <div className="app-header__notif-empty">
              <span>No notifications</span>
            </div>
          ) : (
            <ul className="app-header__notif-list">
              {notifications.slice(0, 20).map((n) => (
                <li
                  key={n.id}
                  className={`app-header__notif-item ${!n.read ? "is-unread" : ""}`}
                  onClick={() => !n.read && markRead(n.id)}
                >
                  <div className="app-header__notif-content">
                    {n.type === "message" && n.senderName && (
                      <small className="app-header__notif-sender">
                        From: {n.senderName}
                      </small>
                    )}
                    <span className="app-header__notif-title">{n.title}</span>
                    <p className="app-header__notif-body">{n.body}</p>
                    <small className="app-header__notif-time">
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                  {n.type === "message" && (
                    <button
                      className="app-header__notif-reply-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReply(n);
                      }}
                      type="button"
                      title={`Reply to ${n.senderName}`}
                    >
                      <Send size={14} />
                      <span>Reply</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </HeaderPanel>
      )}

      {/* Reply / Send Message Modal */}
      {replyTarget && (
        <SendMessageModal
          open={msgModalOpen}
          onClose={handleCloseMsgModal}
          recipientUid={replyTarget.uid}
          recipientName={replyTarget.name}
        />
      )}
    </CarbonHeader>
  );
};

export default Header;
