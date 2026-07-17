/**
 * useNotifications.ts
 *
 * Hook to fetch the currently signed-in profile's notifications from Firebase.
 */
import { useEffect, useState, useCallback } from "react";
import type { ChurchNotification } from "@/features/notifications/types";
import { NotificationService } from "@/features/notifications/services/notification.service";
import { getSavedProfileUid } from "@/features/profile/hooks/useProfile";

interface UseNotificationsReturn {
  notifications: ChurchNotification[];
  unreadCount: number;
  isLoading: boolean;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useNotifications = (
  recipientUid?: string | null,
): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<ChurchNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const resolvedRecipientUid = recipientUid ?? getSavedProfileUid() ?? "";

  const refresh = useCallback(async () => {
    if (!resolvedRecipientUid) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);

    try {
      const nextNotifications =
        await NotificationService.getAll(resolvedRecipientUid);
      setNotifications(nextNotifications);
      setUnreadCount(nextNotifications.filter((n) => !n.read).length);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedRecipientUid]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markRead = useCallback(
    async (notificationId: string) => {
      if (!resolvedRecipientUid) return;

      await NotificationService.markRead(resolvedRecipientUid, notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [resolvedRecipientUid],
  );

  const markAllRead = useCallback(async () => {
    if (!resolvedRecipientUid) return;

    await NotificationService.markAllRead(resolvedRecipientUid);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [resolvedRecipientUid]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    refresh,
  };
};
