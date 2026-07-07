import { MemberService } from "@/features/members/services/member.services";
import { NotificationService } from "@/features/notifications/services/notification.service";

export async function notifyOnEventCreated(
  event: {
    title?: string;
    venue?: string;
  } | null,
): Promise<void> {
  if (!event) return;

  const members = await MemberService.getAll();
  if (!members.length) return;

  const eventTitle = event.title?.trim() || "A new event";
  const locationText = event.venue?.trim() ? ` at ${event.venue}` : "";
  const body = `${eventTitle} has been added to the church calendar${locationText}.`;

  await Promise.allSettled(
    members.map((member) => {
      const recipientUid = member._firebaseKey ?? member.id ?? "";
      if (!recipientUid) return Promise.resolve();

      return NotificationService.send({
        type: "announcement",
        title: "New event created",
        body,
        senderUid: "system",
        senderName: "Church Admin",
        recipientUid,
      });
    }),
  );
}
