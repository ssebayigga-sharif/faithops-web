import type { AxiosResponse } from "axios";
import { firebaseClient } from "@/shared/services/firebase.client";
import type {
  ChurchEvent,
  CommunicationChannel,
  EventCategory,
  EventColorKey,
  EventDepartment,
  EventMediaAttachment,
  EventPermission,
  EventRecurrence,
  EventStatus,
  EventVolunteerAssignment,
} from "@/features/events/types";

const EVENTS_PATH = "/events";

type FirebaseEventMap = Record<string, Omit<ChurchEvent, "_firebaseKey">>;

const DEFAULT_CHANNELS: CommunicationChannel[] = ["Email", "SMS", "WhatsApp"];
const DEFAULT_DEPARTMENT: EventDepartment = "Pastoral";
const DEFAULT_CATEGORY: EventCategory = "Sabbath Service";

const CATEGORY_COLORS: Record<EventCategory, EventColorKey> = {
  "Sabbath Service": "sabbath",
  "Divine Service": "sabbath",
  "AY Program": "youth",
  Evangelism: "evangelism",
  Pathfinder: "pathfinder",
  Communion: "communion",
  "Prayer Meeting": "prayer",
  "Camp Meeting": "evangelism",
  "Health Seminar": "health",
  "Bible Study": "prayer",
  "Choir Practice": "choir",
  "Board Meeting": "board",
  "Baptism Class": "evangelism",
  "Community Outreach": "health",
};

function asList<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function normaliseEvent(
  raw: Partial<ChurchEvent>,
  firebaseKey?: string,
): ChurchEvent {
  const category = raw.category ?? DEFAULT_CATEGORY;
  const department = raw.department ?? DEFAULT_DEPARTMENT;
  const now = new Date().toISOString();
  const start = raw.start ?? now;
  const end = raw.end ?? start;
  const recurrence: EventRecurrence = raw.recurrence ?? {
    frequency: "None",
    rule: "One-time event",
  };
  const volunteers = asList<EventVolunteerAssignment>(raw.volunteers);
  const permissions = asList<EventPermission>(raw.permissions);
  const attachments = asList<EventMediaAttachment>(raw.attachments);

  return {
    _firebaseKey: firebaseKey,
    id: raw.id ?? `EVT-${firebaseKey?.slice(-6).toUpperCase() ?? Date.now()}`,
    title: raw.title ?? "Untitled event",
    description: raw.description ?? "",
    department,
    category,
    colorKey: raw.colorKey ?? CATEGORY_COLORS[category],
    venue: raw.venue ?? "Main sanctuary",
    start,
    end,
    recurrence,
    speaker: raw.speaker ?? "To be assigned",
    capacity: raw.capacity ?? 0,
    registrationRequired: raw.registrationRequired ?? false,
    volunteersNeeded: raw.volunteersNeeded ?? volunteers.length,
    budgetAllocated: raw.budgetAllocated ?? 0,
    budgetSpent: raw.budgetSpent ?? 0,
    status: raw.status ?? ("Draft" satisfies EventStatus),
    attendance: {
      registered: raw.attendance?.registered ?? 0,
      actual: raw.attendance?.actual ?? 0,
      members: raw.attendance?.members ?? 0,
      visitors: raw.attendance?.visitors ?? 0,
      followUpRequired: raw.attendance?.followUpRequired ?? 0,
      conversions: raw.attendance?.conversions ?? 0,
      baptisms: raw.attendance?.baptisms ?? 0,
    },
    volunteers,
    communications: {
      channels: asList<CommunicationChannel>(raw.communications?.channels)
        .length
        ? asList<CommunicationChannel>(raw.communications?.channels)
        : DEFAULT_CHANNELS,
      rsvpTracking: raw.communications?.rsvpTracking ?? false,
      automations: asList(raw.communications?.automations),
    },
    permissions,
    attachments,
    notes: asList(raw.notes),
    reports: asList(raw.reports),
    enterpriseReadiness: asList(raw.enterpriseReadiness),
  };
}

function mapToEvents(data: FirebaseEventMap | null): ChurchEvent[] {
  if (!data) return [];

  return Object.entries(data)
    .map(([firebaseKey, raw]) => normaliseEvent(raw, firebaseKey))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

function removeFirebaseKey(
  event: ChurchEvent,
): Omit<ChurchEvent, "_firebaseKey"> {
  const { _firebaseKey, ...payload } = event;
  return payload;
}

export const EventService = {
  async getAll(): Promise<ChurchEvent[]> {
    const res: AxiosResponse<FirebaseEventMap | null> =
      await firebaseClient.get(`${EVENTS_PATH}.json`, {
        params: {
          orderBy: '"start"',
        },
      });

    return mapToEvents(res.data);
  },

  async getOne(firebaseKey: string): Promise<ChurchEvent> {
    const res: AxiosResponse<Omit<ChurchEvent, "_firebaseKey"> | null> =
      await firebaseClient.get(`${EVENTS_PATH}/${firebaseKey}.json`);

    if (!res.data) {
      throw new Error(`Event with key "${firebaseKey}" not found.`);
    }

    return normaliseEvent(res.data, firebaseKey);
  },

  async create(event: Omit<ChurchEvent, "_firebaseKey">): Promise<ChurchEvent> {
    const res: AxiosResponse<{ name: string }> = await firebaseClient.post(
      `${EVENTS_PATH}.json`,
      event,
    );

    return normaliseEvent(event, res.data.name);
  },

  async update(
    firebaseKey: string,
    event: Omit<ChurchEvent, "_firebaseKey">,
  ): Promise<ChurchEvent> {
    await firebaseClient.put(`${EVENTS_PATH}/${firebaseKey}.json`, event);
    return normaliseEvent(event, firebaseKey);
  },

  async patch(
    firebaseKey: string,
    partial: Partial<Omit<ChurchEvent, "_firebaseKey">>,
  ): Promise<void> {
    await firebaseClient.patch(`${EVENTS_PATH}/${firebaseKey}.json`, partial);
  },

  async remove(firebaseKey: string): Promise<void> {
    await firebaseClient.delete(`${EVENTS_PATH}/${firebaseKey}.json`);
  },

  toPayload: removeFirebaseKey,
} as const;
