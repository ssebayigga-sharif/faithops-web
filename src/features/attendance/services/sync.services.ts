/**
 * sync.services.ts
 *
 * Synchronises attendance records back to:
 *   - Member profiles (attendance array + timeline)
 *   - Member computed fields (via re-fetch)
 *   - Event attendance stats
 *
 * This bridges the gap between the centralised attendance system and
 * the individual feature data stores.
 */

import { firebaseClient } from "@/shared/services/firebase.client";
import { MemberService } from "@/features/members/services/member.services";
import type {
  AttendanceRecord,
  AttendanceRow,
} from "@/features/attendance/types";
import type {
  MemberAttendanceRecord,
  MemberTimelineEvent,
} from "@/features/members/types";

const MEMBERS_PATH = "/members";

// ─── Sync Attendance → Member Profile ──────────────────────────────────

/**
 * After a bulk save, this function updates each member's attendance array
 * and timeline inside Firebase so member-level computed fields are accurate.
 */
export async function syncAttendanceToMembers(
  sessionId: string,
  date: string,
  rows: AttendanceRow[],
  markedBy: string,
  serviceType: string,
): Promise<void> {
  const updates: Record<string, unknown> = {};

  const memberRecord: MemberAttendanceRecord = {
    date,
    serviceType: serviceType as any,
    sessionId,
    status: "present",
    markedBy,
  };

  for (const row of rows) {
    const memberId = row.memberId;
    if (!memberId) continue;

    memberRecord.status = row.status;

    // Push attendance record
    const attendancePushKey = `-att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    updates[`${MEMBERS_PATH}/${memberId}/attendance/${attendancePushKey}`] =
      memberRecord;

    // Push timeline event
    const timelinePushKey = `-tl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timelineEvent: MemberTimelineEvent = {
      id: timelinePushKey,
      type: "attendance",
      description: `Marked ${row.status} for ${serviceType} on ${date}`,
      date: new Date().toISOString(),
    };
    updates[`${MEMBERS_PATH}/${memberId}/timeline/${timelinePushKey}`] =
      timelineEvent;
  }

  // Batch update all members in one request
  if (Object.keys(updates).length > 0) {
    await firebaseClient.patch(`/${MEMBERS_PATH}.json`, updates);
  }
}

// ─── Detect & Create Follow-Up Tasks ────────────────────────────────────

const CONSECUTIVE_MISS_THRESHOLD = 2;

export interface FollowUpCandidate {
  memberId: string;
  memberName: string;
  consecutiveMisses: number;
  lastAttended: string | null;
}

/**
 * Scans all members and identifies those who need pastoral follow-up
 * based on consecutive missed sessions.
 */
export async function detectFollowUpCandidates(): Promise<FollowUpCandidate[]> {
  const members = await MemberService.getAll();
  const candidates: FollowUpCandidate[] = [];

  for (const member of members) {
    if (
      member._computed &&
      member._computed.consecutiveMisses >= CONSECUTIVE_MISS_THRESHOLD
    ) {
      // Check if a follow-up task already exists for this pattern
      const hasRecentFollowUp = (member.followUps ?? []).some(
        (f) =>
          f.task.toLowerCase().includes("attendance") && f.status !== "done",
      );

      if (!hasRecentFollowUp) {
        candidates.push({
          memberId: member._firebaseKey ?? member.id,
          memberName: member._computed.fullName,
          consecutiveMisses: member._computed.consecutiveMisses,
          lastAttended: member._computed.lastAttended,
        });
      }
    }
  }

  return candidates;
}

/**
 * Creates a follow-up task for a member who has missed multiple sessions.
 */
export async function createFollowUpTask(
  memberFirebaseKey: string,
  candidate: FollowUpCandidate,
  assignedTo: string = "Pastoral Team",
): Promise<void> {
  const pushKey = `-fu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // 3 days to follow up

  const task = {
    id: pushKey,
    task: `Attendance follow-up: ${candidate.memberName} has missed ${candidate.consecutiveMisses} consecutive session(s). Last attended: ${candidate.lastAttended ?? "Never"}.`,
    status: "pending" as const,
    assignedTo,
    dueDate: dueDate.toISOString().split("T")[0],
  };

  await firebaseClient.patch(
    `${MEMBERS_PATH}/${memberFirebaseKey}/followUps/${pushKey}.json`,
    task,
  );

  // Also add timeline entry
  const tlKey = `-tl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await firebaseClient.patch(
    `${MEMBERS_PATH}/${memberFirebaseKey}/timeline/${tlKey}.json`,
    {
      id: tlKey,
      type: "followup",
      description: `Auto-generated follow-up for ${candidate.consecutiveMisses} consecutive missed sessions`,
      date: new Date().toISOString(),
    },
  );
}

// ─── Sync Attendance → Event Stats ─────────────────────────────────────

const EVENTS_PATH = "/events";

/**
 * Updates event attendance stats when a session is saved that matches
 * an event category.
 */
export async function syncAttendanceToEvents(
  date: string,
  serviceType: string,
  totalAttended: number,
): Promise<void> {
  try {
    const { data: events } = await firebaseClient.get<Record<
      string,
      any
    > | null>(`${EVENTS_PATH}.json`);

    if (!events) return;

    // Find events happening on the same date
    const matchingEvents = Object.entries(events).filter(
      ([, ev]) =>
        ev.start?.startsWith(date) &&
        (ev.category?.toLowerCase().includes(serviceType.toLowerCase()) ||
          serviceType.toLowerCase().includes(ev.category?.toLowerCase() ?? "")),
    );

    for (const [eventId, event] of matchingEvents) {
      const currentActual = event.attendance?.actual ?? 0;
      if (totalAttended > currentActual) {
        await firebaseClient.patch(
          `${EVENTS_PATH}/${eventId}/attendance.json`,
          {
            actual: totalAttended,
          },
        );
      }
    }
  } catch {
    // Silently fail - event sync is non-critical
    console.warn("Failed to sync attendance to events");
  }
}
