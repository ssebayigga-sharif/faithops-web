import { useEffect, useState, useCallback, useRef } from "react";
import { ref, onValue, off } from "firebase/database";
import { getFirebaseDatabase } from "@/shared/services/firebase";
import type { ChurchNotification } from "@/features/notifications/types";
import { NotificationService } from "@/features/notifications/services/notification.service";

const NOTIFICATIONS_PATH = "/notifications";

interface UseNotificationsReturn {
  notifications: ChurchNotification[];
  unreadCount: number;
  isLoading: boolean;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

function extractNotifications(
  data: Record<string, Omit<ChurchNotification, "id">> | null,
): ChurchNotification[] {
  if (!data) return [];
  return Object.entries(data)
    .map(([key, val]) => ({ ...val, id: key }) as ChurchNotification)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export const useNotifications = (
  recipientUid?: string | null,
): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<ChurchNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const listenerAttachedRef = useRef(false);

  const resolvedRecipientUid = recipientUid ?? "";

  // ── Real-time Firebase listener ────────────────────────────────
  useEffect(() => {
    if (!resolvedRecipientUid) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      listenerAttachedRef.current = false;
      return;
    }

    setIsLoading(true);
    listenerAttachedRef.current = true;

    const db = getFirebaseDatabase();
    const notifRef = ref(db, `${NOTIFICATIONS_PATH}/${resolvedRecipientUid}`);

    // Subscribe to real-time updates
    const unsubscribe = onValue(
      notifRef,
      (snapshot) => {
        const data = snapshot.val() as Record<
          string,
          Omit<ChurchNotification, "id">
        > | null;
        const nextNotifications = extractNotifications(data);
        setNotifications(nextNotifications);
        setUnreadCount(nextNotifications.filter((n) => !n.read).length);
        setIsLoading(false);
      },
      (error) => {
        console.error("Real-time notification listener error", error);
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
      },
    );

    return () => {
      off(notifRef);
      unsubscribe();
      listenerAttachedRef.current = false;
    };
  }, [resolvedRecipientUid]);

  // ── Manual refresh (kept for backward compatibility) ──────────
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

  // ── Actions ───────────────────────────────────────────────────
  const markRead = useCallback(
    async (notificationId: string) => {
      if (!resolvedRecipientUid) return;

      await NotificationService.markRead(resolvedRecipientUid, notificationId);
      // Optimistic update – real-time listener will confirm
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
