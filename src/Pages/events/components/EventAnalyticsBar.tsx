import {
  Calendar,
  Group,
  Report,
  UserFollow,
  UserMultiple,
} from "@carbon/icons-react";
import { Column, Grid, ProgressBar, Stack, Tile } from "@carbon/react";
import type {
  EventAnalyticsBarProps,
  EventMetric,
  EventTrendPoint,
} from "@/churchTypes/events";

function TrendBars({
  title,
  points,
  max,
}: {
  title: string;
  points: EventTrendPoint[];
  max: number;
}) {
  return (
    <Stack className="events-chart" gap={4}>
      <h3>{title}</h3>
      {points.map((point) => (
        <Stack className="events-chart__row" gap={2} key={point.label}>
          <Stack
            className="events-chart__meta"
            orientation="horizontal"
            gap={4}
          >
            <span>{point.label}</span>
            <strong>{point.value.toLocaleString()}</strong>
          </Stack>
          <ProgressBar
            hideLabel
            label={`${title} ${point.label}`}
            max={max}
            size="small"
            status="active"
            value={point.value}
          />
        </Stack>
      ))}
    </Stack>
  );
}

export function EventAnalyticsBar({ snapshot }: EventAnalyticsBarProps) {
  const metrics: EventMetric[] = [
    {
      label: "Upcoming events",
      value: snapshot.upcomingEvents.toLocaleString(),
      meta: "Scheduled from today forward",
      accent: "#0f62fe",
      icon: Calendar,
    },
    {
      label: "This month",
      value: snapshot.thisMonthEvents.toLocaleString(),
      meta: "May operational calendar",
      accent: "#198038",
      icon: Report,
    },
    {
      label: "Avg attendance",
      value: snapshot.averageAttendance.toLocaleString(),
      meta: "Completed event average",
      accent: "#009d9a",
      icon: Group,
    },
    {
      label: "Active department",
      value: snapshot.mostActiveDepartment,
      meta: "Highest event ownership",
      accent: "#8a3ffc",
      icon: UserMultiple,
    },
    {
      label: "Baptisms",
      value: snapshot.baptismsFromEvents.toLocaleString(),
      meta: "Tracked from events",
      accent: "#c6971a",
      icon: UserFollow,
    },
    {
      label: "Volunteer rate",
      value: `${snapshot.volunteerParticipationRate}%`,
      meta: "Assigned vs needed roles",
      accent: "#da1e28",
      icon: UserMultiple,
    },
  ];

  const trendMax = Math.max(
    ...snapshot.monthlyTrend.map((point) => point.value),
    1,
  );
  const attendanceMax = Math.max(
    ...snapshot.attendanceGrowth.map((point) => point.value),
    1,
  );
  const departmentMax = Math.max(
    ...snapshot.departmentActivity.map((point) => point.count),
    1,
  );

  return (
    <Stack gap={5}>
      <Grid className="events-analytics-grid" fullWidth withRowGap>
        {metrics.map(({ icon: Icon, ...metric }) => (
          <Column key={metric.label} sm={4} md={4} lg={4}>
            <Tile
              className="event-metric-card"
              style={{ borderLeftColor: metric.accent }}
            >
              <Stack orientation="horizontal" gap={4}>
                <span
                  className="event-metric-card__icon"
                  style={{
                    color: metric.accent,
                    backgroundColor: `${metric.accent}1a`,
                  }}
                >
                  <Icon size={20} />
                </span>
                <Stack gap={1}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.meta}</small>
                </Stack>
              </Stack>
            </Tile>
          </Column>
        ))}
      </Grid>

      <Grid className="events-chart-grid" fullWidth withRowGap>
        <Column sm={4} md={4} lg={5}>
          <Tile className="events-chart-tile">
            <TrendBars
              title="Monthly event trends"
              points={snapshot.monthlyTrend}
              max={trendMax}
            />
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={5}>
          <Tile className="events-chart-tile">
            <TrendBars
              title="Attendance growth"
              points={snapshot.attendanceGrowth}
              max={attendanceMax}
            />
          </Tile>
        </Column>
        <Column sm={4} md={8} lg={6}>
          <Tile className="events-chart-tile">
            <Stack className="events-chart" gap={4}>
              <h3>Department activity comparison</h3>
              {snapshot.departmentActivity.slice(0, 5).map((department) => (
                <Stack
                  className="events-chart__row"
                  gap={2}
                  key={department.department}
                >
                  <Stack
                    className="events-chart__meta"
                    orientation="horizontal"
                    gap={4}
                  >
                    <span>{department.department}</span>
                    <strong>{department.count}</strong>
                  </Stack>
                  <ProgressBar
                    hideLabel
                    label={`${department.department} activity`}
                    max={departmentMax}
                    size="small"
                    status="active"
                    value={department.count}
                  />
                </Stack>
              ))}
            </Stack>
          </Tile>
        </Column>
      </Grid>
    </Stack>
  );
}
