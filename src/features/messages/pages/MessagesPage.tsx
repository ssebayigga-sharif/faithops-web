import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ref, get, child } from "firebase/database";
import { getFirebaseDatabase } from "@/shared/services/firebase";
import {
  Button,
  TextArea,
  Search,
  Loading,
  InlineNotification,
} from "@carbon/react";
import { Send, ChatLaunch } from "@carbon/icons-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { SlideOver } from "@/shared/components/ui/SlideOver";
import { ConversationService } from "../services/conversation.services";
import { useConversations } from "../hook/useConversations";
import { useMessages } from "../hook/useMessages";
import type { ChurchProfile } from "@/features/profile/types";
import type { MemberListItem } from "../types/types";
import styles from "./messagepage.module.scss";

const MessagesPage = () => {
  const { user } = useAuth();
  const { profile: senderProfile } = useProfile();
  const { conversations, isLoading: isLoadingConversations } =
    useConversations();

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<MemberListItem[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { messages, isLoading: isLoadingMessages } =
    useMessages(activeConversationId);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const senderInfo = useMemo(
    () => ({
      uid: user?.uid ?? "",
      fullName:
        [senderProfile?.firstName, senderProfile?.lastName]
          .filter(Boolean)
          .join(" ") ||
        user?.displayName ||
        user?.email ||
        "Church Member",
      email: senderProfile?.email || user?.email || "",
      photoUrl: senderProfile?.profilePhotoUrl || "",
    }),
    [user, senderProfile],
  );

  // Load the member directory only when the "new message" picker opens —
  // no reason to pull every profile on every page visit.
  useEffect(() => {
    if (!isPickerOpen || allMembers.length > 0) return;
    const db = getFirebaseDatabase();
    get(child(ref(db), "profiles")).then((snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as Record<string, ChurchProfile>;
      const list = Object.entries(data)
        .filter(([uid]) => uid !== user?.uid)
        .map(([uid, profile]) => ({
          uid,
          fullName:
            [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
            "Unknown",
          email: profile.email || "",
          photoUrl: profile.profilePhotoUrl || "",
        }));
      setAllMembers(list);
    });
  }, [isPickerOpen, allMembers.length, user?.uid]);

  const filteredMembers = useMemo(() => {
    const q = memberSearch.toLowerCase().trim();
    if (!q) return allMembers;
    return allMembers.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    );
  }, [allMembers, memberSearch]);

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      setActiveConversationId(conversationId);
      setError(null);
      if (user?.uid) {
        ConversationService.markConversationRead(conversationId, user.uid);
      }
    },
    [user?.uid],
  );

  const handleStartConversation = useCallback(
    async (member: MemberListItem) => {
      if (!user?.uid) return;
      try {
        const conversationId =
          await ConversationService.getOrCreateConversation(senderInfo, member);
        setIsPickerOpen(false);
        setMemberSearch("");
        handleSelectConversation(conversationId);
      } catch {
        setError("Couldn't start that conversation. Please try again.");
      }
    },
    [user?.uid, senderInfo, handleSelectConversation],
  );

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !activeConversationId || !activeConversation || !user?.uid) {
      return;
    }
    setIsSending(true);
    setError(null);
    try {
      await ConversationService.sendMessage(
        activeConversationId,
        senderInfo,
        activeConversation.otherParticipant.uid,
        text,
      );
      setDraft("");
    } catch {
      setError("Message failed to send. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [draft, activeConversationId, activeConversation, user?.uid, senderInfo]);

  const messageListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
    });
  }, [messages]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Messages</h2>
        <Button
          kind="primary"
          size="sm"
          renderIcon={ChatLaunch}
          onClick={() => setIsPickerOpen(true)}
        >
          New message
        </Button>
      </div>

      <div className={styles.layout}>
        {/* Conversation list */}
        <div className={styles.listPanel}>
          {isLoadingConversations ? (
            <div className={styles.centered}>
              <Loading
                description="Loading conversations..."
                withOverlay={false}
              />
            </div>
          ) : conversations.length === 0 ? (
            <div className={styles.emptyState}>
              No conversations yet. Start one with the button above.
            </div>
          ) : (
            <ul className={styles.conversationList}>
              {conversations.map((conversation) => (
                <li
                  key={conversation.id}
                  role="button"
                  tabIndex={0}
                  aria-current={conversation.id === activeConversationId}
                  className={
                    conversation.id === activeConversationId
                      ? `${styles.conversationItem} ${styles.conversationItemActive}`
                      : styles.conversationItem
                  }
                  onClick={() => handleSelectConversation(conversation.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectConversation(conversation.id);
                    }
                  }}
                >
                  <div className={styles.avatar}>
                    {conversation.otherParticipant.photoUrl ? (
                      <img
                        src={conversation.otherParticipant.photoUrl}
                        alt=""
                      />
                    ) : (
                      getInitials(conversation.otherParticipant.fullName)
                    )}
                  </div>
                  <div className={styles.conversationMeta}>
                    <div className={styles.conversationName}>
                      {conversation.otherParticipant.fullName}
                    </div>
                    <div className={styles.conversationPreview}>
                      {conversation.lastMessage?.text ?? "No messages yet"}
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span
                      className={styles.unreadBadge}
                      aria-label={`${conversation.unreadCount} unread messages`}
                    >
                      {conversation.unreadCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Thread */}
        <div className={styles.threadPanel}>
          {!activeConversation ? (
            <div className={styles.emptyThread}>
              <Send size={32} />
              <span>Select a conversation or start a new one.</span>
            </div>
          ) : (
            <>
              <div className={styles.threadHeader}>
                {activeConversation.otherParticipant.fullName}
              </div>

              {error && (
                <InlineNotification
                  kind="error"
                  title="Error"
                  subtitle={error}
                  lowContrast
                  onClose={() => setError(null)}
                />
              )}

              <div className={styles.messageList} ref={messageListRef}>
                {isLoadingMessages ? (
                  <Loading
                    description="Loading messages..."
                    withOverlay={false}
                  />
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.senderUid === user?.uid
                          ? `${styles.bubble} ${styles.bubbleOwn}`
                          : styles.bubble
                      }
                    >
                      <p>{message.text}</p>
                      <time>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.composer}>
                <TextArea
                  id="message-draft"
                  labelText="Message"
                  hideLabel
                  placeholder="Type a message..."
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isSending}
                />
                <Button
                  kind="primary"
                  renderIcon={Send}
                  iconDescription="Send"
                  hasIconOnly
                  onClick={handleSend}
                  disabled={isSending || !draft.trim()}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <SlideOver
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="New message"
      >
        <Search
          size="lg"
          labelText="Search members"
          placeholder="Search by name or email..."
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
        />
        <ul className={styles.pickerList}>
          {filteredMembers.map((member) => (
            <li
              key={member.uid}
              role="button"
              tabIndex={0}
              className={styles.pickerItem}
              onClick={() => handleStartConversation(member)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleStartConversation(member);
                }
              }}
            >
              <div className={styles.avatar}>
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt="" />
                ) : (
                  getInitials(member.fullName)
                )}
              </div>
              <span>{member.fullName}</span>
            </li>
          ))}
        </ul>
      </SlideOver>
    </div>
  );
};

export default MessagesPage;
