import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { ConversationService } from "../services/conversation.services";
import type { ConversationPreview } from "../types/types";

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setConversations([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    return ConversationService.subscribeToUserConversations(
      user.uid,
      (list) => {
        setConversations(list);
        setIsLoading(false);
      },
    );
  }, [user?.uid]);

  return { conversations, isLoading };
}
