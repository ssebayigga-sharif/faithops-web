/**
 * notifications/types.ts
 */

export type NotificationType =
  | "message"
  | "event_reminder"
  | "follow_up"
  | "role_update"
  | "announcement";

export interface ChurchNotification {
  /** Firebase push key (auto-generated) */
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** Firebase Auth UID of the sender */
  senderUid: string;
  /** Full name of the sender (denormalised for display) */
  senderName: string;
  /** Firebase Auth UID of the recipient — this is the routing key */
  recipientUid: string;
  read: boolean;
  createdAt: string;
}

export interface EmailDeliveryPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  from?: string;
  metadata?: Record<string, string>;
}
