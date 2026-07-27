import { useCallback } from "react";
import { HeaderPanel, SwitcherDivider } from "@carbon/react";
import { ReplyAll, Send } from "@carbon/icons-react";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { ChurchNotification } from "@/features/notifications/types";

type HeaderNotificationsProps = {
  open: boolean;
  unreadCount: number;
  onMarkAllRead: () => Promise<void>;
};

export const HeaderNotifications = ({
  open,
  unreadCount,
  onMarkAllRead,
}: HeaderNotificationsProps) => {
  const { user } = useAuth();
  const activeUid = user?.uid ?? "";
  const { notifications, markRead } = useNotifications(activeUid);

  const handleReply = useCallback((notification: ChurchNotification) => {
    // handled by parent via reply target
  }, []);

  return (
    <HeaderPanel aria-label="Notifications panel">
      <div className="app-header__notif-header">
        <strong>Notifications</strong>
        {notifications.length > 0 && unreadCount > 0 && (
          <button
            className="app-header__notif-mark-read"
            onClick={onMarkAllRead}
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
  );
};
