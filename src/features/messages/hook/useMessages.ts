import { useEffect, useState } from "react";
import { ConversationService } from "../services/conversation.services";
import type { Message } from "../types/types";

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    return ConversationService.subscribeToMessages(conversationId, (list) => {
      setMessages(list);
      setIsLoading(false);
    });
  }, [conversationId]);

  return { messages, isLoading };
}
