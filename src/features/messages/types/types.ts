export interface ConversationParticipant {
  uid: string;
  fullName: string;
  email: string;
  photoUrl: string;
}

export interface ConversationPreview {
  id: string;
  otherParticipant: ConversationParticipant;
  lastMessage: {
    text: string;
    senderUid: string;
    timestamp: number;
  } | null;
  updatedAt: number;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderUid: string;
  senderName: string;
  text: string;
  timestamp: number;
  readBy: Record<string, boolean>;
}

export interface MemberListItem {
  uid: string;
  fullName: string;
  email: string;
  photoUrl: string;
}
