import { Button, ProgressBar, Stack, Tag, Tile } from "@carbon/react";
import { UserFollow } from "@carbon/icons-react";
import type { UpcomingEventsFeedProps } from "@/features/events/types";
import {
  daysUntilEvent,
  formatEventDateTime,
  getAttendanceRate,
  getVolunteerParticipationRate,
} from "../eventUtils";

export function UpcomingEventsFeed({
  events,
  onSelectEvent,
}: UpcomingEventsFeedProps) {
  const upcoming = events.slice(0, 6);

  return (
    <Tile className="event-side-panel">
      <Stack gap={5}>
        <Stack
          className="event-section__header"
          orientation="horizontal"
          gap={5}
        >
          <Stack gap={2}>
            <h2>Upcoming Events Feed</h2>
            <p>
              Near-term programs, reminders, RSVP state, and volunteer
              readiness.
            </p>
          </Stack>
          <Tag type="cyan" size="sm">
            Live
          </Tag>
        </Stack>

        <Stack gap={4}>
          {upcoming.map((event) => {
            const daysUntil = daysUntilEvent(event);
            const volunteerRate = getVolunteerParticipationRate(event);
            const attendanceRate = getAttendanceRate(event);

            return (
              <Tile
                className={`event-feed-card event-feed-card--${event.colorKey}`}
                key={event.id}
              >
                <Stack gap={4}>
                  <Stack orientation="horizontal" gap={4}>
                    <UserFollow size={20} />
                    <Stack gap={1}>
                      <h3>{event.title}</h3>
                      <p>
                        {formatEventDateTime(event.start)} · {event.venue}
                      </p>
                    </Stack>
                    <Tag
                      type={
                        event.status === "Needs volunteers"
                          ? "magenta"
                          : event.status === "Pending approval"
                            ? "purple"
                            : "green"
                      }
                      size="sm"
                    >
                      {daysUntil <= 0 ? "Today" : `${daysUntil}d`}
                    </Tag>
                  </Stack>

                  <Stack gap={3}>
                    <ProgressBar
                      label="Volunteer participation"
                      helperText={`${volunteerRate}% volunteer coverage`}
                      max={100}
                      size="small"
                      status={volunteerRate < 70 ? "error" : "finished"}
                      value={volunteerRate}
                    />
                    <ProgressBar
                      label="Attendance engagement"
                      helperText={`${attendanceRate}% attendance or registration utilization`}
                      max={100}
                      size="small"
                      status={attendanceRate < 40 ? "active" : "finished"}
                      value={attendanceRate}
                    />
                  </Stack>

                  <Stack orientation="horizontal" gap={3}>
                    <Button
                      kind="ghost"
                      size="sm"
                      onClick={() => onSelectEvent(event)}
                    >
                      Open workspace
                    </Button>
                    <Button kind="tertiary" size="sm">
                      Send reminder
                    </Button>
                  </Stack>
                </Stack>
              </Tile>
            );
          })}
        </Stack>
      </Stack>
    </Tile>
  );
}
