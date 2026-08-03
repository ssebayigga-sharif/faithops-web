import {
  ref,
  push,
  set,
  update,
  get,
  child,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  getFirebaseDatabase,
  getFirebaseAuth,
} from "../../../shared/services/firebase";
import type {
  ChurchNotification,
  EmailDeliveryPayload,
} from "../types";

const NOTIFICATIONS_PATH = "/notifications";
const EMAIL_OUTBOX_PATH = "/emailOutbox";

export const NotificationService = {
  async send(
    notification: Omit<ChurchNotification, "id" | "createdAt" | "read">,
  ): Promise<ChurchNotification> {
    const db = getFirebaseDatabase();
    const notificationsRef = ref(
      db,
      `${NOTIFICATIONS_PATH}/${notification.recipientUid}`,
    );
    const newRef = push(notificationsRef);
    const id = newRef.key!;
    const now = new Date().toISOString();

    const payload: ChurchNotification = {
      ...notification,
      id,
      read: false,
      createdAt: now,
    };

    await set(newRef, payload);
    return payload;
  },

  async getAll(recipientUid: string): Promise<ChurchNotification[]> {
    const db = getFirebaseDatabase();
    const snapshot = await get(
      child(ref(db), `${NOTIFICATIONS_PATH}/${recipientUid}`),
    );

    if (!snapshot.exists()) return [];

    const data = snapshot.val() as Record<
      string,
      Omit<ChurchNotification, "id">
    >;
    const notifications: ChurchNotification[] = Object.entries(data).map(
      ([key, val]) => ({
        ...val,
        id: key,
      }),
    );

    notifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return notifications;
  },

  async getUnreadCount(recipientUid: string): Promise<number> {
    const db = getFirebaseDatabase();
    const notificationsRef = ref(db, `${NOTIFICATIONS_PATH}/${recipientUid}`);
    const unreadQuery = query(
      notificationsRef,
      orderByChild("read"),
      equalTo(false),
    );

    const snapshot = await get(unreadQuery);
    if (!snapshot.exists()) return 0;

    return Object.keys(snapshot.val()).length;
  },

  async markRead(recipientUid: string, notificationId: string): Promise<void> {
    const db = getFirebaseDatabase();
    await update(
      ref(db, `${NOTIFICATIONS_PATH}/${recipientUid}/${notificationId}`),
      { read: true },
    );
  },

  async markAllRead(recipientUid: string): Promise<void> {
    const db = getFirebaseDatabase();
    const snapshot = await get(
      child(ref(db), `${NOTIFICATIONS_PATH}/${recipientUid}`),
    );

    if (!snapshot.exists()) return;

    const data = snapshot.val() as Record<string, ChurchNotification>;
    const updates: Record<string, boolean> = {};

    Object.keys(data).forEach((key) => {
      updates[`${key}/read`] = true;
    });

    await update(ref(db, `${NOTIFICATIONS_PATH}/${recipientUid}`), updates);
  },

  async sendEmail(payload: EmailDeliveryPayload): Promise<{
    status: "sent" | "queued";
    provider: "webhook" | "outbox";
  }> {
    const db = getFirebaseDatabase();
    const webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL?.trim();
    const from =
      payload.from ??
      import.meta.env.VITE_EMAIL_FROM?.trim() ??
      "faithops@church.local";

    const emailPayload = {
      to: payload.to,
      subject: payload.subject,
      html: payload.htmlBody,
    };

    if (webhookUrl) {
      try {
        const auth = getFirebaseAuth();
        const user = auth.currentUser;
        if (!user) {
          console.warn(
            "sendEmail: No authenticated user — falling back to email outbox",
          );
          throw new Error("No authenticated user");
        }
        const token = await user.getIdToken();

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(emailPayload),
        });

        if (!response.ok) {
          throw new Error(
            `Email delivery failed with status ${response.status}`,
          );
        }

        return { status: "sent", provider: "webhook" };
      } catch (error) {
        console.error("Email delivery webhook failed", error);
      }
    }

    const outboxRef = push(ref(db, EMAIL_OUTBOX_PATH));
    await set(outboxRef, {
      ...emailPayload,
      status: "queued",
      createdAt: new Date().toISOString(),
      provider: "outbox",
    });

    return { status: "queued", provider: "outbox" };
  },
};
