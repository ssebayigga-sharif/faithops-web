import {
  Button,
  Column,
  Grid,
  ProgressBar,
  Stack,
  Tag,
  Tile,
} from "@carbon/react";
import { Group, UserFollow } from "@carbon/icons-react";
import type { MinistryCoordinationPanelProps } from "@/features/events/types";
import { formatEventDate, getVolunteerParticipationRate } from "../eventUtils";

export function MinistryCoordinationPanel({
  events,
  onSelectEvent,
}: MinistryCoordinationPanelProps) {
  const coordinationEvents = events
    .filter((event) => event.volunteers.length > 0)
    .sort(
      (a, b) =>
        getVolunteerParticipationRate(a) - getVolunteerParticipationRate(b),
    )
    .slice(0, 4);

  return (
    <Tile className="ministry-coordination">
      <Stack gap={5}>
        <Stack
          className="event-section__header"
          orientation="horizontal"
          gap={5}
        >
          <Stack gap={2}>
            <h2>Ministry Coordination Panel</h2>
            <p>
              Volunteer assignments, duty rosters, department responsibilities,
              and service teams.
            </p>
          </Stack>
          <Tag type="magenta" size="sm">
            Rosters
          </Tag>
        </Stack>

        <Grid className="ministry-coordination__grid" fullWidth withRowGap>
          {coordinationEvents.map((event) => {
            const coverage = getVolunteerParticipationRate(event);
            const needed = event.volunteers.filter(
              (volunteer) => volunteer.status === "Needed",
            ).length;

            return (
              <Column key={event.id} sm={4} md={4} lg={8}>
                <Tile className="ministry-roster-card">
                  <Stack gap={4}>
                    <Stack orientation="horizontal" gap={4}>
                      <span
                        className={`event-type-dot event-type-dot--${event.colorKey}`}
                      />
                      <Stack gap={1}>
                        <h3>{event.title}</h3>
                        <p>
                          {formatEventDate(event.start)} · {event.department}
                        </p>
                      </Stack>
                      <Tag type={needed > 0 ? "red" : "green"} size="sm">
                        {needed > 0 ? `${needed} gaps` : "Covered"}
                      </Tag>
                    </Stack>

                    <ProgressBar
                      label="Roster coverage"
                      helperText={`${coverage}% of needed roles assigned`}
                      max={100}
                      size="small"
                      status={coverage < 70 ? "error" : "finished"}
                      value={coverage}
                    />

                    <Stack className="duty-roster" gap={3}>
                      {event.volunteers.slice(0, 6).map((volunteer) => (
                        <Stack
                          className="duty-roster__row"
                          orientation="horizontal"
                          gap={4}
                          key={`${event.id}-${volunteer.role}`}
                        >
                          <UserFollow size={16} />
                          <Stack gap={1}>
                            <strong>{volunteer.role}</strong>
                            <span>
                              {volunteer.assignee} · {volunteer.callTime}
                            </span>
                          </Stack>
                          <Tag
                            type={
                              volunteer.status === "Needed" ? "red" : "blue"
                            }
                            size="sm"
                          >
                            {volunteer.status}
                          </Tag>
                        </Stack>
                      ))}
                    </Stack>

                    <Stack orientation="horizontal" gap={3}>
                      <Button
                        kind="secondary"
                        renderIcon={Group}
                        size="sm"
                        onClick={() => onSelectEvent(event)}
                      >
                        Assign team
                      </Button>
                      <Button kind="ghost" size="sm">
                        Check in
                      </Button>
                    </Stack>
                  </Stack>
                </Tile>
              </Column>
            );
          })}
        </Grid>
      </Stack>
    </Tile>
  );
}
