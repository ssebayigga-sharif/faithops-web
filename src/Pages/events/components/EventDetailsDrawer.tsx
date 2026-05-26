import {
  Button,
  Column,
  Grid,
  ProgressBar,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tile,
} from "@carbon/react";
import { Download, Email, UserFollow } from "@carbon/icons-react";
import { SlideOver } from "@/components/ui/SlideOver";
import type { EventDetailsDrawerProps } from "@/churchTypes/events";
import {
  formatEventDateTime,
  formatUGX,
  getAttendanceRate,
  getBudgetUsageRate,
  getEventDurationLabel,
  getVolunteerParticipationRate,
  percentage,
} from "../eventUtils";

const DETAIL_TABS = [
  "Overview",
  "Attendees",
  "Volunteers",
  "Budget",
  "Media",
  "Notes",
  "Reports",
];

export function EventDetailsDrawer({
  event,
  open,
  onClose,
}: EventDetailsDrawerProps) {
  if (!event) {
    return null;
  }

  const attendanceRate = getAttendanceRate(event);
  const volunteerRate = getVolunteerParticipationRate(event);
  const budgetRate = getBudgetUsageRate(event);
  const visitorRate = percentage(
    event.attendance.visitors,
    event.attendance.actual,
  );

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={event.title}
      eyebrow={`${event.category} · ${event.department}`}
      description={`${formatEventDateTime(event.start)} - ${formatEventDateTime(event.end)} · ${event.venue}`}
      width="lg"
      footer={
        <>
          <Button kind="secondary" onClick={onClose}>
            Close
          </Button>
          <Button renderIcon={Email}>Send announcement</Button>
        </>
      }
    >
      <Stack className="event-detail-drawer" gap={5}>
        <Grid fullWidth withRowGap>
          <Column sm={4} md={4} lg={4}>
            <Tile className="event-detail-stat">
              <span>Attendance</span>
              <strong>{attendanceRate}%</strong>
              <small>{event.attendance.actual.toLocaleString()} actual</small>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <Tile className="event-detail-stat">
              <span>Volunteers</span>
              <strong>{volunteerRate}%</strong>
              <small>{event.volunteersNeeded} roles needed</small>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <Tile className="event-detail-stat">
              <span>Budget</span>
              <strong>{budgetRate}%</strong>
              <small>{formatUGX(event.budgetSpent)} spent</small>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <Tile className="event-detail-stat">
              <span>Visitors</span>
              <strong>{visitorRate}%</strong>
              <small>{event.attendance.visitors} visitors</small>
            </Tile>
          </Column>
        </Grid>

        <Tabs>
          <TabList aria-label="Event detail tabs" contained>
            {DETAIL_TABS.map((tab) => (
              <Tab key={tab}>{tab}</Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack className="event-detail-tab" gap={5}>
                <Tile>
                  <Stack gap={4}>
                    <h3>Program overview</h3>
                    <p>{event.description}</p>
                    <Stack
                      className="event-detail-tags"
                      orientation="horizontal"
                      gap={3}
                    >
                      <Tag type="blue">{event.status}</Tag>
                      <Tag type="cyan">{event.recurrence.frequency}</Tag>
                      <Tag type="purple">{getEventDurationLabel(event)}</Tag>
                      {event.registrationRequired && (
                        <Tag type="green">RSVP tracking</Tag>
                      )}
                    </Stack>
                  </Stack>
                </Tile>

                <Grid fullWidth withRowGap>
                  <Column sm={4} md={4} lg={8}>
                    <Tile>
                      <Stack gap={3}>
                        <h3>Recurring events engine</h3>
                        <p>{event.recurrence.rule}</p>
                        <small>
                          Designed to avoid recreating weekly Sabbath services,
                          monthly communion, quarterly camp meetings, and annual
                          conventions.
                        </small>
                      </Stack>
                    </Tile>
                  </Column>
                  <Column sm={4} md={4} lg={8}>
                    <Tile>
                      <Stack gap={3}>
                        <h3>Permission model</h3>
                        {event.permissions.map((permission) => (
                          <Stack
                            orientation="horizontal"
                            gap={3}
                            key={`${permission.role}-${permission.scope}`}
                          >
                            <Tag type="gray" size="sm">
                              {permission.level}
                            </Tag>
                            <span>
                              {permission.role} · {permission.scope}
                            </span>
                          </Stack>
                        ))}
                      </Stack>
                    </Tile>
                  </Column>
                </Grid>
              </Stack>
            </TabPanel>

            <TabPanel>
              <Stack className="event-detail-tab" gap={5}>
                <ProgressBar
                  label="Registered attendees"
                  helperText={`${event.attendance.registered.toLocaleString()} registered of ${event.capacity.toLocaleString()} capacity`}
                  max={event.capacity}
                  value={event.attendance.registered}
                />
                <ProgressBar
                  label="Actual attendance"
                  helperText={`${event.attendance.members} members · ${event.attendance.visitors} visitors`}
                  max={event.capacity}
                  status={attendanceRate < 40 ? "active" : "finished"}
                  value={event.attendance.actual}
                />
                <Grid fullWidth withRowGap>
                  {[
                    [
                      "Visitors vs members",
                      `${event.attendance.visitors} visitors · ${event.attendance.members} members`,
                    ],
                    [
                      "Follow-up required",
                      `${event.attendance.followUpRequired} people`,
                    ],
                    [
                      "Conversion tracking",
                      `${event.attendance.conversions} decisions`,
                    ],
                    [
                      "Baptisms from events",
                      `${event.attendance.baptisms} baptisms`,
                    ],
                  ].map(([label, value]) => (
                    <Column key={label} sm={4} md={4} lg={4}>
                      <Tile className="event-detail-stat">
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </Tile>
                    </Column>
                  ))}
                </Grid>
              </Stack>
            </TabPanel>

            <TabPanel>
              <Stack className="event-detail-tab" gap={4}>
                {event.volunteers.map((volunteer) => (
                  <Tile
                    className="event-volunteer-row"
                    key={`${volunteer.role}-${volunteer.assignee}`}
                  >
                    <Stack orientation="horizontal" gap={4}>
                      <UserFollow size={18} />
                      <Stack gap={1}>
                        <strong>{volunteer.role}</strong>
                        <span>
                          {volunteer.assignee} · {volunteer.department} ·{" "}
                          {volunteer.callTime}
                        </span>
                      </Stack>
                      <Tag
                        type={volunteer.status === "Needed" ? "red" : "blue"}
                        size="sm"
                      >
                        {volunteer.status}
                      </Tag>
                    </Stack>
                  </Tile>
                ))}
              </Stack>
            </TabPanel>

            <TabPanel>
              <Stack className="event-detail-tab" gap={5}>
                <ProgressBar
                  label="Budget utilization"
                  helperText={`${formatUGX(event.budgetSpent)} spent of ${formatUGX(event.budgetAllocated)}`}
                  max={100}
                  status={budgetRate > 90 ? "error" : "active"}
                  value={budgetRate}
                />
                <Grid fullWidth withRowGap>
                  <Column sm={4} md={4} lg={8}>
                    <Tile>
                      <Stack gap={2}>
                        <span>Budget allocation</span>
                        <strong>{formatUGX(event.budgetAllocated)}</strong>
                      </Stack>
                    </Tile>
                  </Column>
                  <Column sm={4} md={4} lg={8}>
                    <Tile>
                      <Stack gap={2}>
                        <span>Budget spent</span>
                        <strong>{formatUGX(event.budgetSpent)}</strong>
                      </Stack>
                    </Tile>
                  </Column>
                </Grid>
              </Stack>
            </TabPanel>

            <TabPanel>
              <Stack className="event-detail-tab" gap={4}>
                {event.attachments.map((attachment) => (
                  <Tile
                    className="event-media-row"
                    key={`${attachment.type}-${attachment.name}`}
                  >
                    <Stack orientation="horizontal" gap={4}>
                      <Download size={18} />
                      <Stack gap={1}>
                        <strong>{attachment.name}</strong>
                        <span>
                          {attachment.type} · {attachment.owner}
                        </span>
                      </Stack>
                      <Tag
                        type={attachment.status === "Ready" ? "green" : "gray"}
                        size="sm"
                      >
                        {attachment.status}
                      </Tag>
                    </Stack>
                  </Tile>
                ))}
              </Stack>
            </TabPanel>

            <TabPanel>
              <Stack className="event-detail-tab" gap={4}>
                {event.notes.map((note) => (
                  <Tile key={note}>
                    <p>{note}</p>
                  </Tile>
                ))}
                <Tile>
                  <Stack gap={3}>
                    <h3>Communication system</h3>
                    <p>{event.communications.channels.join(", ")}</p>
                    {event.communications.automations.map((automation) => (
                      <Tag type="blue" key={automation}>
                        {automation}
                      </Tag>
                    ))}
                  </Stack>
                </Tile>
              </Stack>
            </TabPanel>

            <TabPanel>
              <Stack className="event-detail-tab" gap={4}>
                {event.reports.map((report) => (
                  <Tile key={report}>
                    <p>{report}</p>
                  </Tile>
                ))}
                <Tile>
                  <Stack gap={3}>
                    <h3>Future enterprise readiness</h3>
                    {event.enterpriseReadiness.map((feature) => (
                      <Stack
                        orientation="horizontal"
                        gap={3}
                        key={feature.label}
                      >
                        <Tag
                          type={feature.status === "Ready" ? "green" : "cyan"}
                          size="sm"
                        >
                          {feature.status}
                        </Tag>
                        <span>{feature.label}</span>
                      </Stack>
                    ))}
                  </Stack>
                </Tile>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </SlideOver>
  );
}
