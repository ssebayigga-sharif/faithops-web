import type { ChurchEvent, EventFormDraft } from "@/features/events/types";

function toIsoDateTime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

function getEventWindow(dateValue: string) {
  const base = toIsoDateTime(dateValue);
  const start = base;
  const end = new Date(base).getTime() + 1000 * 60 * 60;

  return {
    start,
    end: new Date(end).toISOString(),
  };
}

export function createEventFromDraft(
  draft: EventFormDraft,
): Omit<ChurchEvent, "_firebaseKey"> {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `EVT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
      : `EVT-${Date.now()}`;
  const { start, end } = getEventWindow(draft.date);
  const isCompleted = new Date(end).getTime() < Date.now();

  return {
    id,
    title: draft.title || "Untitled church event",
    description:
      draft.description || "A simple event created from the operations form.",
    organizer: draft.organizer || "Church office",
    department: "Pastoral",
    category: "Sabbath Service",
    colorKey: "sabbath",
    venue: draft.venue || "Main sanctuary",
    start,
    end,
    recurrence: {
      frequency: "None",
      rule: "One-time event",
    },
    speaker: draft.speaker || "To be assigned",
    capacity: 0,
    registrationRequired: false,
    volunteersNeeded: 0,
    budgetAllocated: 0,
    budgetSpent: 0,
    status: isCompleted ? "Completed" : "Approved",
    attendance: {
      registered: 0,
      actual: 0,
      members: 0,
      visitors: 0,
      followUpRequired: 0,
      conversions: 0,
      baptisms: 0,
    },
    volunteers: [],
    communications: {
      channels: ["Email"],
      rsvpTracking: false,
      automations: [],
    },
    permissions: [],
    attachments: [],
    notes: ["Created from the simple event form."],
    reports: [],
    enterpriseReadiness: [],
  };
}
