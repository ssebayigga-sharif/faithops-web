import { getDatabase, ref, push, serverTimestamp } from "firebase/database";

export interface HelpRequestPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitHelpRequest(
  payload: HelpRequestPayload,
): Promise<void> {
  const db = getDatabase();
  await push(ref(db, "helpRequests"), {
    ...payload,
    createdAt: serverTimestamp(),
    status: "new",
  });
}
