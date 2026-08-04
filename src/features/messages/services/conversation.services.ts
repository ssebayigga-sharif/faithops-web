import {
  ref,
  get,
  update,
  push,
  onValue,
  off,
  increment,
  type DataSnapshot,
} from "firebase/database";
import { getFirebaseDatabase } from "../../../shared/services/firebase";
import { EmailNotificationService } from "./emailNotification.services";
import type {
  ConversationParticipant,
  ConversationPreview,
  Message,
} from "../types/types";

const getConversationId = (uidA: string, uidB: string): string =>
  [uidA, uidB].sort().join("_");

export const ConversationService = {
  getConversationId,

  /** Idempotent: safe to call every time a user opens a thread with someone new. */
  async getOrCreateConversation(
    currentUser: ConversationParticipant,
    otherUser: ConversationParticipant,
  ): Promise<string> {
    const db = getFirebaseDatabase();
    const conversationId = getConversationId(currentUser.uid, otherUser.uid);

    const existing = await get(
      ref(db, `userConversations/${currentUser.uid}/${conversationId}`),
    );
    if (existing.exists()) {
      return conversationId;
    }

    const timestamp = Date.now();
    const updates: Record<string, unknown> = {
      [`conversations/${conversationId}/participants`]: {
        [currentUser.uid]: true,
        [otherUser.uid]: true,
      },
      [`conversations/${conversationId}/createdAt`]: timestamp,
      [`userConversations/${currentUser.uid}/${conversationId}`]: {
        otherParticipant: otherUser,
        lastMessage: null,
        updatedAt: timestamp,
        unreadCount: 0,
      },
      [`userConversations/${otherUser.uid}/${conversationId}`]: {
        otherParticipant: currentUser,
        lastMessage: null,
        updatedAt: timestamp,
        unreadCount: 0,
      },
    };

    await update(ref(db), updates);
    return conversationId;
  },

  subscribeToUserConversations(
    uid: string,
    onChange: (conversations: ConversationPreview[]) => void,
  ): () => void {
    const db = getFirebaseDatabase();
    const indexRef = ref(db, `userConversations/${uid}`);

    const handler = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        onChange([]);
        return;
      }
      const data = snapshot.val() as Record<
        string,
        Omit<ConversationPreview, "id">
      >;
      const list = Object.entries(data)
        .map(([id, preview]) => ({ id, ...preview }))
        .sort((a, b) => b.updatedAt - a.updatedAt);
      onChange(list);
    };

    onValue(indexRef, handler);
    return () => off(indexRef, "value", handler);
  },

  subscribeToMessages(
    conversationId: string,
    onChange: (messages: Message[]) => void,
  ): () => void {
    const db = getFirebaseDatabase();
    const messagesRef = ref(db, `conversations/${conversationId}/messages`);

    const handler = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        onChange([]);
        return;
      }
      const data = snapshot.val() as Record<string, Omit<Message, "id">>;
      const messages = Object.entries(data)
        .map(([id, msg]) => ({ id, ...msg }))
        .sort((a, b) => a.timestamp - b.timestamp);
      onChange(messages);
    };

    onValue(messagesRef, handler);
    return () => off(messagesRef, "value", handler);
  },

  async sendMessage(
    conversationId: string,
    sender: ConversationParticipant,
    recipientUid: string,
    text: string,
  ): Promise<void> {
    const db = getFirebaseDatabase();
    const timestamp = Date.now();
    const newMessageRef = push(
      ref(db, `conversations/${conversationId}/messages`),
    );

    const message: Omit<Message, "id"> = {
      senderUid: sender.uid,
      senderName: sender.fullName,
      text,
      timestamp,
      readBy: { [sender.uid]: true },
    };
    const lastMessage = { text, senderUid: sender.uid, timestamp };

    const updates: Record<string, unknown> = {
      [`conversations/${conversationId}/messages/${newMessageRef.key}`]:
        message,
      [`userConversations/${sender.uid}/${conversationId}/lastMessage`]:
        lastMessage,
      [`userConversations/${sender.uid}/${conversationId}/updatedAt`]:
        timestamp,
      [`userConversations/${recipientUid}/${conversationId}/lastMessage`]:
        lastMessage,
      [`userConversations/${recipientUid}/${conversationId}/updatedAt`]:
        timestamp,
      [`userConversations/${recipientUid}/${conversationId}/unreadCount`]:
        increment(1),
    };

    await update(ref(db), updates);

    void EmailNotificationService.notifyMessage(
      conversationId,
      newMessageRef.key!,
      recipientUid,
    );
  },

  async markConversationRead(
    conversationId: string,
    uid: string,
  ): Promise<void> {
    const db = getFirebaseDatabase();
    await update(ref(db, `userConversations/${uid}/${conversationId}`), {
      unreadCount: 0,
    });
  },
};
