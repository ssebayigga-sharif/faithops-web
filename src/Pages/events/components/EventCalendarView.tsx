import { useMemo, useState } from "react";
import {
  Button,
  ContentSwitcher,
  Stack,
  Switch,
  Tag,
  Tile,
} from "@carbon/react";
import { Calendar, Renew } from "@carbon/icons-react";
import type {
  ChurchEvent,
  EventCalendarView as CalendarView,
  EventCalendarViewProps,
} from "@/churchTypes/events";
import { EVENT_CALENDAR_VIEWS } from "../eventData";
import {
  formatEventDate,
  formatEventTime,
  getCalendarDays,
  getCalendarTitle,
  getEventsForDate,
  getEventsForRange,
  getUpcomingEvents,
  getWeekDays,
  moveCalendarAnchor,
} from "../eventUtils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sabbath"];

function EventPill({
  event,
  selected,
  onSelectEvent,
}: {
  event: ChurchEvent;
  selected: boolean;
  onSelectEvent: (event: ChurchEvent) => void;
}) {
  return (
    <button
      className={`event-pill event-pill--${event.colorKey}${selected ? " is-selected" : ""}`}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelectEvent(event);
      }}
    >
      <span>{formatEventTime(event.start)}</span>
      <strong>{event.title}</strong>
    </button>
  );
}

function CalendarLegend() {
  const labels = [
    ["sabbath", "Sabbath programs"],
    ["youth", "Youth events"],
    ["evangelism", "Evangelism campaigns"],
    ["pathfinder", "Pathfinder activities"],
    ["choir", "Choir rehearsals"],
    ["board", "Board meetings"],
    ["communion", "Communion services"],
  ] as const;

  return (
    <Stack className="event-calendar__legend" orientation="horizontal" gap={3}>
      {labels.map(([key, label]) => (
        <span className={`event-legend event-legend--${key}`} key={key}>
          {label}
        </span>
      ))}
    </Stack>
  );
}

function MonthView({
  anchor,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  anchor: Date;
  events: ChurchEvent[];
  selectedEventId?: string;
  onSelectEvent: (event: ChurchEvent) => void;
}) {
  const days = getCalendarDays(anchor);

  return (
    <Stack className="event-calendar__month" gap={2}>
      <Stack className="event-calendar__weekdays">
        {WEEKDAY_LABELS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </Stack>

      <Stack className="event-calendar__days">
        {days.map((day) => {
          const dayEvents = getEventsForDate(events, day);
          const isOutsideMonth = day.getMonth() !== anchor.getMonth();

          return (
            <Tile
              className={`event-calendar__day${isOutsideMonth ? " is-muted" : ""}`}
              key={day.toISOString()}
            >
              <Stack gap={3}>
                <span className="event-calendar__date">{day.getDate()}</span>
                <Stack className="event-calendar__day-events" gap={2}>
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventPill
                      event={event}
                      key={event.id}
                      selected={event.id === selectedEventId}
                      onSelectEvent={onSelectEvent}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <Tag type="gray" size="sm">
                      +{dayEvents.length - 3} more
                    </Tag>
                  )}
                </Stack>
              </Stack>
            </Tile>
          );
        })}
      </Stack>
    </Stack>
  );
}

function WeekView({
  anchor,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  anchor: Date;
  events: ChurchEvent[];
  selectedEventId?: string;
  onSelectEvent: (event: ChurchEvent) => void;
}) {
  const days = getWeekDays(anchor);

  return (
    <Stack className="event-calendar__week">
      {days.map((day) => {
        const dayEvents = getEventsForDate(events, day);
        return (
          <Tile className="event-calendar__week-column" key={day.toISOString()}>
            <Stack gap={4}>
              <Stack gap={1}>
                <strong>{WEEKDAY_LABELS[day.getDay()]}</strong>
                <span>{formatEventDate(day)}</span>
              </Stack>
              <Stack gap={3}>
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <EventPill
                      event={event}
                      key={event.id}
                      selected={event.id === selectedEventId}
                      onSelectEvent={onSelectEvent}
                    />
                  ))
                ) : (
                  <p className="event-muted-copy">No events scheduled.</p>
                )}
              </Stack>
            </Stack>
          </Tile>
        );
      })}
    </Stack>
  );
}

function DayView({
  anchor,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  anchor: Date;
  events: ChurchEvent[];
  selectedEventId?: string;
  onSelectEvent: (event: ChurchEvent) => void;
}) {
  const dayEvents = getEventsForDate(events, anchor);

  return (
    <Stack className="event-calendar__agenda" gap={4}>
      {dayEvents.length > 0 ? (
        dayEvents.map((event) => (
          <Tile
            className={`event-agenda-card event-agenda-card--${event.colorKey}`}
            key={event.id}
            onClick={() => onSelectEvent(event)}
          >
            <Stack orientation="horizontal" gap={5}>
              <Stack gap={1}>
                <strong>{formatEventTime(event.start)}</strong>
                <span>{formatEventTime(event.end)}</span>
              </Stack>
              <Stack gap={2}>
                <h3>{event.title}</h3>
                <p>
                  {event.venue} · {event.department}
                </p>
              </Stack>
              <Tag
                type={event.status === "Needs volunteers" ? "magenta" : "blue"}
                size="sm"
              >
                {event.status}
              </Tag>
            </Stack>
          </Tile>
        ))
      ) : (
        <Tile>
          <p className="event-muted-copy">No events scheduled for this day.</p>
        </Tile>
      )}
      {selectedEventId && (
        <span className="event-screen-reader">
          Selected event loaded in details drawer.
        </span>
      )}
    </Stack>
  );
}

function AgendaView({
  anchor,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  anchor: Date;
  events: ChurchEvent[];
  selectedEventId?: string;
  onSelectEvent: (event: ChurchEvent) => void;
}) {
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59);
  const agendaEvents = getEventsForRange(events, start, end);

  return (
    <Stack className="event-calendar__agenda" gap={4}>
      {agendaEvents.map((event) => (
        <Tile
          className={`event-agenda-card event-agenda-card--${event.colorKey}${event.id === selectedEventId ? " is-selected" : ""}`}
          key={event.id}
          onClick={() => onSelectEvent(event)}
        >
          <Stack orientation="horizontal" gap={5}>
            <Calendar size={20} />
            <Stack gap={1}>
              <h3>{event.title}</h3>
              <p>
                {formatEventDate(event.start)} · {formatEventTime(event.start)}{" "}
                · {event.venue}
              </p>
            </Stack>
            <Tag type="cyan" size="sm">
              {event.category}
            </Tag>
          </Stack>
        </Tile>
      ))}
    </Stack>
  );
}

export function EventCalendarView({
  events,
  selectedEventId,
  onSelectEvent,
}: EventCalendarViewProps) {
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState(() => new Date("2026-05-01T00:00:00"));
  const selectedIndex = EVENT_CALENDAR_VIEWS.indexOf(view);

  const upcoming = useMemo(
    () => getUpcomingEvents(events).slice(0, 4),
    [events],
  );

  return (
    <Tile className="event-calendar">
      <Stack gap={5}>
        <Stack
          className="event-section__header"
          orientation="horizontal"
          gap={5}
        >
          <Stack gap={2}>
            <h2>Event Calendar View</h2>
            <p>
              Month, week, day, and agenda views with SDA ministry color coding.
            </p>
          </Stack>
          <Tag type="blue" size="sm">
            {getCalendarTitle(view, anchor)}
          </Tag>
        </Stack>

        <Stack
          className="event-calendar__toolbar"
          orientation="horizontal"
          gap={4}
        >
          <ContentSwitcher
            selectedIndex={selectedIndex}
            size="sm"
            onChange={({ index }) => {
              setView(EVENT_CALENDAR_VIEWS[index ?? 0]);
            }}
          >
            {EVENT_CALENDAR_VIEWS.map((calendarView) => (
              <Switch
                key={calendarView}
                name={calendarView}
                text={calendarView[0].toUpperCase() + calendarView.slice(1)}
              />
            ))}
          </ContentSwitcher>

          <Stack
            className="event-calendar__nav"
            orientation="horizontal"
            gap={2}
          >
            <Button
              kind="ghost"
              size="sm"
              onClick={() =>
                setAnchor((current) => moveCalendarAnchor(view, current, -1))
              }
            >
              Previous
            </Button>
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Renew}
              onClick={() => setAnchor(new Date("2026-05-01T00:00:00"))}
            >
              Today
            </Button>
            <Button
              kind="ghost"
              size="sm"
              onClick={() =>
                setAnchor((current) => moveCalendarAnchor(view, current, 1))
              }
            >
              Next
            </Button>
          </Stack>
        </Stack>

        <CalendarLegend />

        {view === "month" && (
          <MonthView
            anchor={anchor}
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={onSelectEvent}
          />
        )}
        {view === "week" && (
          <WeekView
            anchor={anchor}
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={onSelectEvent}
          />
        )}
        {view === "day" && (
          <DayView
            anchor={anchor}
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={onSelectEvent}
          />
        )}
        {view === "agenda" && (
          <AgendaView
            anchor={anchor}
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={onSelectEvent}
          />
        )}

        <Stack className="event-calendar__mobile-feed" gap={3}>
          <h3>Next programs</h3>
          {upcoming.map((event) => (
            <EventPill
              event={event}
              key={event.id}
              selected={event.id === selectedEventId}
              onSelectEvent={onSelectEvent}
            />
          ))}
        </Stack>
      </Stack>
    </Tile>
  );
}
