import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // adjust to your env var convention

export const EmailNotificationService = {
  /** Fire-and-forget by design: email is a fallback channel, not the primary
   *  send path — a failure here should never block or error out the in-app message. */
  async notifyMessage(
    conversationId: string,
    messageId: string,
    recipientUid: string,
  ): Promise<void> {
    try {
      const idToken = await getAuth().currentUser?.getIdToken();
      if (!idToken) return;

      await fetch(`${BACKEND_URL}/api/notify-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ conversationId, messageId, recipientUid }),
      });
    } catch (error) {
      console.error("Email notification failed (non-blocking):", error);
    }
  },
};
