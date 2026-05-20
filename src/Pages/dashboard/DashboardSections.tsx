import {
  Calendar,
  Finance,
  Group,
  Notification,
  Report,
  UserFollow,
  UserMultiple,
  WarningAlt,
} from "@carbon/icons-react";
import { Grid, Column, Stack } from "@carbon/react";
import type { DashboardSnapshot } from "@/churchTypes/dashboardTypes";
import type { ChurchEvent, EventAnalyticsSnapshot } from "@/churchTypes/eventTypes";
import { formatDate, formatUGX } from "@/utils/memberUtils";
import {
  formatEventDateTime,
  getVolunteerParticipationRate,
} from "@/Pages/events/eventUtils";
import {
  getAttendanceRate,
  getConsecutiveMisses,
  getMemberName,
  percentage,
} from "./dashboardSelectors";
import {
  DashboardPanel,
  InsightItem,
  OperationsRow,
  ProgressRow,
} from "./DashboardPrimitives";

// ─── Shared helpers ────────────────────────────────────────────────────────

function formatPercent(value: number): string {
  return `${value}%`;
}

const EMPTY_COPY = {
  attendance: "No attendance records have been captured yet.",
  ministry: "No active ministry assignments have been recorded.",
  cellGroup: "Cell group attendance will appear after members are assigned.",
} as const;

// ─── AnalyticsPanel ───────────────────────────────────────────────────────────

interface AnalyticsPanelProps {
  snapshot: DashboardSnapshot;
  activeRate: number;
  baptismRate: number;
  loading: boolean;
}

export function AnalyticsPanel({
  snapshot,
  activeRate,
  baptismRate,
  loading,
}: AnalyticsPanelProps) {
  const summaryTiles = [
    {
      label: "Active Members",
      value: snapshot.activeMembers.toLocaleString(),
      sub: `${activeRate}% of all records`,
    },
    {
      label: "New Converts",
      value: snapshot.newConverts.toLocaleString(),
      sub: "Ready for discipleship follow-up",
    },
    {
      label: "Visitors",
      value: snapshot.visitors.toLocaleString(),
      sub: "First-contact pipeline",
    },
    {
      label: "Baptism Rate",
      value: `${baptismRate}%`,
      sub: `${snapshot.baptized.toLocaleString()} baptized members`,
    },
  ];

  return (
    <DashboardPanel
      title="Analytics Overview"
      description="Membership movement, attendance coverage, and ministry participation."
      tagLabel="Live"
      tagType="blue"
      loading={loading}
    >
      <Grid className="dashboard-panel-grid" fullWidth withRowGap>
        <Column sm={4} md={8} lg={7}>
          <Grid
            className="dashboard-analytics__summary"
            fullWidth
            condensed
            withRowGap
          >
            {summaryTiles.map(({ label, value, sub }) => (
              <Column key={label} sm={4} md={4} lg={8}>
                <Stack className="dashboard-summary-tile" gap={1}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>{sub}</small>
                </Stack>
              </Column>
            ))}
          </Grid>
        </Column>

        <Column sm={4} md={8} lg={9}>
          <Stack gap={5}>
            <h3 className="dashboard-subtitle">Recent Attendance</h3>
            <Stack className="bar-list" gap={5}>
              {snapshot.serviceAttendance.length > 0 ? (
                snapshot.serviceAttendance.map((service) => (
                  <ProgressRow
                    key={service.date}
                    label={`${formatDate(service.date)} · ${service.serviceType}`}
                    value={`${service.present}/${service.total}`}
                    percent={percentage(service.present, service.total)}
                  />
                ))
              ) : (
                <p className="dashboard-empty-copy">{EMPTY_COPY.attendance}</p>
              )}
            </Stack>
          </Stack>
        </Column>
      </Grid>
    </DashboardPanel>
  );
}

// ─── NotificationsPanel ───────────────────────────────────────────────────────

interface NotificationsPanelProps {
  snapshot: DashboardSnapshot;
  loading: boolean;
}

export function NotificationsPanel({
  snapshot,
  loading,
}: NotificationsPanelProps) {
  const insights = [
    {
      icon: WarningAlt,
      title: "Follow-up attention",
      description:
        snapshot.overdueFollowUps.length > 0
          ? `${snapshot.overdueFollowUps.length} pastoral follow-up tasks are overdue.`
          : "No overdue follow-up tasks in the current queue.",
      status:
        snapshot.overdueFollowUps.length > 0
          ? ("critical" as const)
          : ("healthy" as const),
      actionLabel: snapshot.overdueFollowUps.length > 0 ? "Action" : "Clear",
    },
    {
      icon: Group,
      title: "Attendance watchlist",
      description: `${snapshot.lowAttendanceMembers.length} members need attendance review or care outreach.`,
      status:
        snapshot.lowAttendanceMembers.length > 0
          ? ("warning" as const)
          : ("healthy" as const),
      actionLabel:
        snapshot.lowAttendanceMembers.length > 0 ? "Review" : "Stable",
    },
    {
      icon: UserFollow,
      title: "Discipleship pipeline",
      description: `${snapshot.newConverts.toLocaleString()} new converts available for mentorship assignment.`,
      status:
        snapshot.newConverts > 0 ? ("info" as const) : ("healthy" as const),
      actionLabel: "Queue",
    },
    {
      icon: Finance,
      title: "Giving summary",
      description: `${formatUGX(snapshot.monthlyGiving)} has been recorded for the current month.`,
      status: "info" as const,
      actionLabel: "Finance",
    },
  ];

  return (
    <DashboardPanel
      title="Notifications"
      description="Priority alerts and system state changes."
      icon={Notification}
      loading={loading}
    >
      <Stack className="insight-list" gap={4}>
        {insights.map((insight) => (
          <InsightItem key={insight.title} {...insight} />
        ))}
      </Stack>
    </DashboardPanel>
  );
}

// ─── OperationalInsightsPanel ─────────────────────────────────────────────────

interface OperationalInsightsPanelProps {
  snapshot: DashboardSnapshot;
  loading: boolean;
}

export function OperationalInsightsPanel({
  snapshot,
  loading,
}: OperationalInsightsPanelProps) {
  return (
    <DashboardPanel
      title="Operational Insights"
      description="Members, ministries, and care workflows that need leadership focus."
      icon={Report}
      loading={loading}
    >
      <Stack className="ops-list" gap={4}>
        {snapshot.lowAttendanceMembers.length > 0 ? (
          snapshot.lowAttendanceMembers.map((member) => (
            <OperationsRow
              key={member.id}
              title={getMemberName(member)}
              description={`${getAttendanceRate(member)}% attendance · ${getConsecutiveMisses(member)} consecutive misses · ${member.cellGroup}`}
              tag="Care"
              tagType="magenta"
            />
          ))
        ) : (
          <OperationsRow
            title="No members on the attendance watchlist"
            description="Attendance risk indicators are within expected range."
            tag="Healthy"
            tagType="green"
          />
        )}
      </Stack>
    </DashboardPanel>
  );
}

// ─── SystemUpdatesPanel ───────────────────────────────────────────────────────

interface SystemUpdatesPanelProps {
  snapshot: DashboardSnapshot;
  isError: boolean;
  loading: boolean;
}

export function SystemUpdatesPanel({
  snapshot,
  isError,
  loading,
}: SystemUpdatesPanelProps) {
  const rows = [
    {
      title: "Firebase member sync",
      description:
        "Member records, computed profiles, and dashboard aggregates are reading from the shared member service.",
      tag: isError ? "Check" : "Synced",
      tagType: isError ? ("red" as const) : ("green" as const),
    },
    {
      title: "Attendance analytics",
      description: `${snapshot.totalAttendanceRecords.toLocaleString()} attendance records are available for trend reporting.`,
      tag: "Ready",
      tagType: "blue" as const,
    },
    {
      title: "Follow-up queue",
      description: `${snapshot.pendingFollowUps.length.toLocaleString()} open care tasks are visible to operations leaders.`,
      tag: snapshot.overdueFollowUps.length > 0 ? "Risk" : "Clear",
      tagType:
        snapshot.overdueFollowUps.length > 0
          ? ("red" as const)
          : ("green" as const),
    },
    {
      title: "Giving summaries",
      description: `${formatUGX(snapshot.givingTotal)} in giving history is available for reporting.`,
      tag: "Finance",
      tagType: "purple" as const,
    },
  ];

  return (
    <DashboardPanel
      title="System Updates"
      description="Core workflows and data readiness across the workspace."
      tagLabel="Online"
      tagType="green"
      loading={loading}
    >
      <Stack className="ops-list" gap={4}>
        {rows.map((row) => (
          <OperationsRow key={row.title} {...row} />
        ))}
      </Stack>
    </DashboardPanel>
  );
}

// ─── MinistryEngagementPanel ──────────────────────────────────────────────────

interface MinistryEngagementPanelProps {
  snapshot: DashboardSnapshot;
  loading: boolean;
}

export function MinistryEngagementPanel({
  snapshot,
  loading,
}: MinistryEngagementPanelProps) {
  return (
    <DashboardPanel
      title="Ministry Engagement"
      description="Active assignments by ministry team."
      icon={UserMultiple}
      loading={loading}
    >
      <Stack className="bar-list" gap={5}>
        {snapshot.ministryEngagement.length > 0 ? (
          snapshot.ministryEngagement.map((m) => (
            <ProgressRow
              key={m.ministry}
              label={m.ministry}
              value={`${m.count.toLocaleString()} members`}
              percent={m.percent}
            />
          ))
        ) : (
          <p className="dashboard-empty-copy">{EMPTY_COPY.ministry}</p>
        )}
      </Stack>
    </DashboardPanel>
  );
}

// ─── CellGroupHealthPanel ─────────────────────────────────────────────────────

interface CellGroupHealthPanelProps {
  snapshot: DashboardSnapshot;
  loading: boolean;
}

export function CellGroupHealthPanel({
  snapshot,
  loading,
}: CellGroupHealthPanelProps) {
  return (
    <DashboardPanel
      title="Cell Group Health"
      description="Attendance quality by cell group."
      icon={Calendar}
      loading={loading}
    >
      <Stack className="bar-list" gap={5}>
        {snapshot.cellGroupHealth.length > 0 ? (
          snapshot.cellGroupHealth.map((g) => (
            <ProgressRow
              key={g.cellGroup}
              label={`${g.cellGroup} · ${g.count} members`}
              value={formatPercent(g.average)}
              percent={g.average}
            />
          ))
        ) : (
          <p className="dashboard-empty-copy">{EMPTY_COPY.cellGroup}</p>
        )}
      </Stack>
    </DashboardPanel>
  );
}

// ─── EventIntelligencePanel ──────────────────────────────────────────────────

interface EventIntelligencePanelProps {
  eventSnapshot: EventAnalyticsSnapshot;
  upcomingEvents: ChurchEvent[];
  todayEvents: ChurchEvent[];
  volunteerShortages: ChurchEvent[];
  pendingApprovals: ChurchEvent[];
  loading: boolean;
}

export function EventIntelligencePanel({
  eventSnapshot,
  upcomingEvents,
  todayEvents,
  volunteerShortages,
  pendingApprovals,
  loading,
}: EventIntelligencePanelProps) {
  const upcomingSabbath =
    upcomingEvents.find(
      (event) =>
        event.category === "Sabbath Service" ||
        event.category === "Divine Service",
    ) ?? upcomingEvents[0];

  return (
    <DashboardPanel
      title="Event Intelligence"
      description="Upcoming church programs, volunteer pressure, approvals, and attendance signals."
      icon={Calendar}
      loading={loading}
    >
      <Grid className="dashboard-panel-grid" fullWidth withRowGap>
        <Column sm={4} md={4} lg={4}>
          <Stack className="dashboard-summary-tile" gap={1}>
            <span>Upcoming Sabbath program</span>
            <strong>{upcomingSabbath?.title ?? "Not scheduled"}</strong>
            <small>
              {upcomingSabbath
                ? formatEventDateTime(upcomingSabbath.start)
                : "Create an event from the Events page"}
            </small>
          </Stack>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Stack className="dashboard-summary-tile" gap={1}>
            <span>Today's meetings</span>
            <strong>{todayEvents.length.toLocaleString()}</strong>
            <small>Programs scheduled for today</small>
          </Stack>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Stack className="dashboard-summary-tile" gap={1}>
            <span>Pending approvals</span>
            <strong>{pendingApprovals.length.toLocaleString()}</strong>
            <small>Pastor or board review needed</small>
          </Stack>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Stack className="dashboard-summary-tile" gap={1}>
            <span>Volunteer shortages</span>
            <strong>{volunteerShortages.length.toLocaleString()}</strong>
            <small>{eventSnapshot.volunteerParticipationRate}% roster coverage</small>
          </Stack>
        </Column>
      </Grid>

      <Grid className="dashboard-panel-grid" fullWidth withRowGap>
        <Column sm={4} md={8} lg={8}>
          <Stack className="ops-list" gap={4}>
            {volunteerShortages.length > 0 ? (
              volunteerShortages.slice(0, 3).map((event) => (
                <OperationsRow
                  key={event.id}
                  title={event.title}
                  description={`${getVolunteerParticipationRate(event)}% volunteer coverage · ${event.department}`}
                  tag="Roster"
                  tagType="magenta"
                />
              ))
            ) : (
              <OperationsRow
                title="No volunteer shortages"
                description="Event duty rosters are currently covered."
                tag="Healthy"
                tagType="green"
              />
            )}
          </Stack>
        </Column>

        <Column sm={4} md={8} lg={8}>
          <Stack gap={5}>
            <h3 className="dashboard-subtitle">Event attendance trends</h3>
            <Stack className="bar-list" gap={5}>
              {eventSnapshot.attendanceGrowth.map((point) => (
                <ProgressRow
                  key={point.label}
                  label={point.label}
                  value={point.value.toLocaleString()}
                  percent={percentage(
                    point.value,
                    Math.max(
                      ...eventSnapshot.attendanceGrowth.map((item) => item.value),
                      1,
                    ),
                  )}
                />
              ))}
            </Stack>
          </Stack>
        </Column>
      </Grid>
    </DashboardPanel>
  );
}
