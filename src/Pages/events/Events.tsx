import { useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Column,
  Grid,
  InlineNotification,
  Stack,
  Tag,
} from "@carbon/react";
import { Add, Download, Renew } from "@carbon/icons-react";
import type {
  ChurchEvent,
  EventFormDraft,
} from "@/churchTypes/eventTypes";
import {
  DEFAULT_EVENT_DRAFT,
  EVENT_CATEGORY_COLOR_KEY,
} from "./eventData";
import { buildEventAnalyticsSnapshot, getUpcomingEvents } from "./eventUtils";
import { useCreateEvent, useEvents } from "@/utils/useEvent";
import { EventAnalyticsBar } from "./components/EventAnalyticsBar";
import { EventCalendarView } from "./components/EventCalendarView";
import { EventDetailsDrawer } from "./components/EventDetailsDrawer";
import { EventFormDrawer } from "./components/EventFormDrawer";
import { EventManagementTable } from "./components/EventManagementTable";
import { MinistryCoordinationPanel } from "./components/MinistryCoordinationPanel";
import { UpcomingEventsFeed } from "./components/UpcomingEventsFeed";

function toIsoDateTime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

function createEventFromDraft(draft: EventFormDraft): Omit<ChurchEvent, "_firebaseKey"> {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `EVT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
      : `EVT-${Date.now()}`;
  const attachments = draft.attachments
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    id,
    title: draft.title || "Untitled church event",
    description:
      draft.description ||
      "New event awaiting department planning, attendance setup, and volunteer assignments.",
    department: draft.department,
    category: draft.category,
    colorKey: EVENT_CATEGORY_COLOR_KEY[draft.category],
    venue: draft.venue,
    start: toIsoDateTime(draft.start),
    end: toIsoDateTime(draft.end),
    recurrence: {
      frequency: draft.recurrenceFrequency,
      rule:
        draft.recurrenceFrequency === "None"
          ? "One-time event"
          : `${draft.recurrenceFrequency} recurrence`,
    },
    speaker: draft.speaker || "To be assigned",
    capacity: draft.capacity,
    registrationRequired: draft.registrationRequired,
    volunteersNeeded: draft.volunteersNeeded,
    budgetAllocated: draft.budgetAllocated,
    budgetSpent: 0,
    status: draft.volunteersNeeded > 0 ? "Needs volunteers" : "Draft",
    attendance: {
      registered: 0,
      actual: 0,
      members: 0,
      visitors: 0,
      followUpRequired: 0,
      conversions: 0,
      baptisms: 0,
    },
    volunteers: [
      {
        role: "Event coordinator",
        assignee: "Needed",
        department: draft.department,
        status: "Needed",
        callTime: "TBD",
      },
    ],
    communications: {
      channels: draft.communicationChannels,
      rsvpTracking: draft.registrationRequired,
      automations: [
        "Reminder 24h before event",
        "Notify volunteers",
        "Follow-up after outreach",
      ],
    },
    permissions: [
      {
        role: "Department leader",
        scope: draft.department,
        level: "Manage",
      },
      {
        role: "Pastor",
        scope: "Major event approval",
        level: "Approve",
      },
    ],
    attachments: attachments.map((name) => ({
      type: "Report",
      name,
      owner: draft.department,
      status: "Draft",
    })),
    notes: [
      "New event created from the operations workspace. Confirm roster, budget, media, and communication plan.",
    ],
    reports: [
      "Awaiting attendance and engagement data.",
      "Enterprise hooks prepared for QR check-in, livestream, registration, and prediction workflows.",
    ],
    enterpriseReadiness: [
      { label: "QR event check-in", status: "Designed" },
      { label: "Livestream integration", status: "Planned" },
      { label: "Ticketing/registration", status: "Designed" },
      { label: "AI attendance predictions", status: "Planned" },
      { label: "Ministry engagement scoring", status: "Designed" },
      { label: "Multi-branch synchronization", status: "Planned" },
    ],
  };
}

export default function EventsPage() {
  const { events, isLoading, isError, error, refetch } = useEvents();
  const { createEvent, isCreating, createError } = useCreateEvent();
  const [draft, setDraft] = useState<EventFormDraft>(DEFAULT_EVENT_DRAFT);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "success" | "error";
    title: string;
    subtitle: string;
  } | null>(null);

  const orderedEvents = useMemo(() => getUpcomingEvents(events), [events]);
  const snapshot = useMemo(() => buildEventAnalyticsSnapshot(events), [events]);

  function updateDraft<Key extends keyof EventFormDraft>(
    field: Key,
    value: EventFormDraft[Key],
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreateEvent() {
    const nextEvent = createEventFromDraft(draft);

    try {
      const savedEvent = await createEvent(nextEvent);
      setSelectedEvent(savedEvent);
      setDraft(DEFAULT_EVENT_DRAFT);
      setIsCreateOpen(false);
      setNotice({
        kind: "success",
        title: "Event created",
        subtitle: `${savedEvent.title} was saved to Firebase.`,
      });
      window.setTimeout(() => setNotice(null), 5000);
    } catch {
      setNotice({
        kind: "error",
        title: "Event save failed",
        subtitle:
          createError ??
          "Could not save this event. Check Firebase rules and your network connection.",
      });
    }
  }

  return (
    <Stack className="admin-page events-page" gap={5}>
      <Stack className="admin-page__inner" gap={5}>
        <Breadcrumb>
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/events" isCurrentPage>
            Events
          </BreadcrumbItem>
        </Breadcrumb>

        <Stack
          as="header"
          className="admin-page__header"
          orientation="horizontal"
          gap={5}
        >
          <Stack gap={2}>
            <h1 className="admin-page__title">SDA Events Operations</h1>
            <p className="admin-page__subtitle">
              Sabbath programs, evangelism, Pathfinder, AY, board governance,
              attendance, volunteers, media, and recurring ministry schedules.
            </p>
          </Stack>

          <Stack className="admin-actions" orientation="horizontal" gap={3}>
            <Button
              kind="ghost"
              renderIcon={Renew}
              size="md"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button kind="secondary" renderIcon={Download} size="md">
              Export
            </Button>
            <Button
              kind="primary"
              renderIcon={Add}
              size="md"
              onClick={() => setIsCreateOpen(true)}
            >
              Create Event
            </Button>
          </Stack>
        </Stack>

        {notice && (
          <InlineNotification
            kind={notice.kind}
            title={notice.title}
            subtitle={notice.subtitle}
            lowContrast
            onCloseButtonClick={() => setNotice(null)}
          />
        )}

        {isError && (
          <InlineNotification
            kind="error"
            title="Events failed to load"
            subtitle={
              error ?? "Check Firebase rules and your network connection."
            }
            lowContrast
          />
        )}

        {!isLoading && !isError && events.length === 0 && (
          <InlineNotification
            kind="info"
            title="No events in Firebase yet"
            subtitle="Create the first SDA event and it will be stored under the /events collection."
            lowContrast
          />
        )}

        <EventAnalyticsBar snapshot={snapshot} />

        <Grid className="events-main-grid" fullWidth withRowGap>
          <Column sm={4} md={8} lg={11}>
            <EventCalendarView
              events={events}
              selectedEventId={selectedEvent?.id}
              onSelectEvent={setSelectedEvent}
            />
          </Column>
          <Column sm={4} md={8} lg={5}>
            <UpcomingEventsFeed
              events={orderedEvents}
              onSelectEvent={setSelectedEvent}
            />
          </Column>
        </Grid>

        <EventManagementTable
          events={orderedEvents}
          onSelectEvent={setSelectedEvent}
        />

        <MinistryCoordinationPanel
          events={orderedEvents}
          onSelectEvent={setSelectedEvent}
        />

        <Grid className="events-enterprise-grid" fullWidth withRowGap>
          {[
            "QR event check-in",
            "Livestream integration",
            "Ticketing and registration",
            "AI attendance predictions",
            "Ministry engagement scoring",
            "Multi-branch synchronization",
          ].map((feature) => (
            <Column key={feature} sm={4} md={4} lg={8}>
              <Tag className="events-enterprise-tag" type="cyan" size="md">
                {feature}
              </Tag>
            </Column>
          ))}
        </Grid>
      </Stack>

      <EventFormDrawer
        open={isCreateOpen}
        draft={draft}
        isSubmitting={isCreating}
        onChange={updateDraft}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <EventDetailsDrawer
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </Stack>
  );
}
