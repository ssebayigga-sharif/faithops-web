/**
 * useNotifications.ts
 *
 * Hook to fetch unread count + notifications list for the currently
 * authenticated user. All data is scoped by the user's Firebase Auth UID.
 */
import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { NotificationService } from "@/features/notifications/services/notification.service";
import type { ChurchNotification } from "@/features/notifications/types";

interface UseNotificationsReturn {
  notifications: ChurchNotification[];
  unreadCount: number;
  isLoading: boolean;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user, userProfile } = useAuthContext();
  const uid = user?.uid;

  const [notifications, setNotifications] = useState<ChurchNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!uid) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const [all, unread] = await Promise.all([
        NotificationService.getAll(uid),
        NotificationService.getUnreadCount(uid),
      ]);
      setNotifications(all);
      setUnreadCount(unread);
    } catch {
      // Silently fail — notifications are non-critical
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  // Fetch on mount and when uid changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  const markRead = useCallback(
    async (notificationId: string) => {
      if (!uid) return;
      await NotificationService.markRead(uid, notificationId);
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [uid],
  );

  const markAllRead = useCallback(async () => {
    if (!uid) return;
    await NotificationService.markAllRead(uid);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [uid]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    refresh,
  };
};
