/**
 * useNotifications.ts
 *
 * Hook to fetch unread count + notifications list. Auth has been removed, so
 * this currently returns an empty notification state.
 */
import { useEffect, useState, useCallback } from "react";
import { get, ref } from "firebase/database";
import { getFirebaseDatabase } from "@/shared/services/firebase";
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
  const [notifications, setNotifications] = useState<ChurchNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const db = getFirebaseDatabase();
      const snapshot = await get(ref(db, "/notifications"));
      const value = snapshot.val() as Record<
        string,
        Record<string, ChurchNotification>
      > | null;

      const nextNotifications = Object.values(value ?? {})
        .flatMap((recipientGroup) =>
          Object.entries(recipientGroup ?? {}).map(([id, notification]) => ({
            ...notification,
            id,
          })),
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      setNotifications(nextNotifications);
      setUnreadCount(nextNotifications.filter((n) => !n.read).length);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and when uid changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  const markRead = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    refresh,
  };
};
