import { useEffect } from "react";
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";
import { getFirebaseDatabase } from "@/shared/services/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";

/** Mount once near the app root. Marks the user online while connected,
 *  and lets Firebase itself flip it offline the instant the socket drops. */
export function usePresence() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;
    const db = getFirebaseDatabase();
    const presenceRef = ref(db, `presence/${user.uid}`);
    const connectedRef = ref(db, ".info/connected");

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() !== true) return;

      onDisconnect(presenceRef)
        .set({ online: false, lastActive: serverTimestamp() })
        .then(() => {
          set(presenceRef, { online: true, lastActive: serverTimestamp() });
        });
    });

    return () => unsubscribe();
  }, [user?.uid]);
}
