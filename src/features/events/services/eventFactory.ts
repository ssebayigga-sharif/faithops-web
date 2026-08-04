import type { ChurchEvent, EventFormDraft } from "../types";

function toIsoDateTime(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return new Date().toISOString();
  return trimmed.length === 16 ? `${trimmed}:00` : trimmed;
}

function getEventWindow(dateValue: string) {
  const base = toIsoDateTime(dateValue);
  const startTime = new Date(base).getTime();
  const safeStart = Number.isNaN(startTime) ? Date.now() : startTime;
  const start = Number.isNaN(startTime) ? new Date(safeStart).toISOString() : base;
  const end = safeStart + 1000 * 60 * 60;

  return {
    start,
    end: new Date(end).toISOString(),
  };
}

function toDateTimeLocalValue(value: string): string {
  if (!value) return "";

  const isLocalDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value);
  if (isLocalDateTime && !value.endsWith("Z")) {
    return value.slice(0, 16);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const localDate = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
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

export function createEventPatchFromDraft(
  draft: EventFormDraft,
  current: ChurchEvent,
): Partial<Omit<ChurchEvent, "_firebaseKey">> {
  const { start, end } = getEventWindow(draft.date || current.start);
  const isCompleted = new Date(end).getTime() < Date.now();

  return {
    title: draft.title || current.title || "Untitled church event",
    description:
      draft.description ||
      current.description ||
      "A simple event created from the operations form.",
    organizer: draft.organizer || current.organizer || "Church office",
    speaker: draft.speaker || current.speaker || "To be assigned",
    venue: draft.venue || current.venue || "Main sanctuary",
    start,
    end,
    status: isCompleted
      ? "Completed"
      : current.status === "Completed"
        ? "Approved"
        : current.status,
  };
}

export function eventToFormDraft(event: ChurchEvent): EventFormDraft {
  return {
    title: event.title,
    description: event.description,
    venue: event.venue,
    date: toDateTimeLocalValue(event.start),
    organizer: event.organizer ?? "",
    speaker: event.speaker,
  };
}
