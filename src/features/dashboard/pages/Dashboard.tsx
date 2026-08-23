import { useNavigate } from "react-router-dom";
import { Button, Column, Grid, InlineNotification, Stack } from "@carbon/react";
import { Add } from "@carbon/icons-react";

import { formatUGX } from "../../members/utils/memberUtils";
import { useDashboardSnapshot } from "../hooks/useDashboardSnapshots";
import { MetricCard } from "../components/DashboardPrimitives";
import { DashboardHero } from "../components/DashboardHero";
import {
  AnalyticsPanel,
  CellGroupHealthPanel,
  EventIntelligencePanel,
  MinistryEngagementPanel,
  NotificationsPanel,
} from "../components/DashboardSections";

function buildMetricCards(
  snapshot: ReturnType<typeof useDashboardSnapshot>["snapshot"],
  activeRate: number,
  attendanceCoverage: number,
) {
  return [
    {
      label: "Total Members",
      value: snapshot.totalMembers.toLocaleString(),
      meta: `${activeRate}% active membership`,
      accent: "#0f62fe",
    },
    {
      label: "Attendance Health",
      value: `${snapshot.attendanceAverage}%`,
      meta: `${attendanceCoverage}% present across tracked records`,
      accent: "#198038",
    },
    {
      label: "Open Follow-ups",
      value: snapshot.pendingFollowUps.length.toLocaleString(),
      meta: `${snapshot.overdueFollowUps.length} overdue · ${snapshot.dueSoonFollowUps.length} due soon`,
      accent: "#da1e28",
    },
    {
      label: "Tracked Giving",
      value: formatUGX(snapshot.givingTotal),
      meta: `${formatUGX(snapshot.monthlyGiving)} this month`,
      accent: "#8a3ffc",
    },
  ] as const;
}

//  Dashboard

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    snapshot,
    activeRate,
    baptismRate,
    attendanceCoverage,
    isLoading,
    isError,
    error,
    eventSnapshot,
    upcomingEvents,
    todayEvents,
    eventVolunteerShortages,
    pendingEventApprovals,
  } = useDashboardSnapshot();

  const metricCards = buildMetricCards(
    snapshot,
    activeRate,
    attendanceCoverage,
  );

  return (
    <Stack as="main" className="admin-page dashboard-page">
      <Stack className="admin-page__inner" gap={5}>
        
        <DashboardHero
          actions={
            <Button
              kind="primary"
              renderIcon={Add}
              size="md"
              onClick={() => navigate("/profile")}
            >
              Create Account
            </Button>
          }
        />

        
        {isError && (
          <InlineNotification
            kind="error"
            title="Dashboard data failed to load"
            subtitle={
              error ?? "Check Firebase rules and your network connection."
            }
            lowContrast
          />
        )}

        
        <Grid
          as="section"
          className="dashboard-carbon-grid"
          fullWidth
          withRowGap
        >
          {metricCards.map((card) => (
            <Column key={card.label} sm={4} md={4} lg={4}>
              <MetricCard {...card} loading={isLoading} />
            </Column>
          ))}
        </Grid>

        
        <Grid className="dashboard-carbon-grid" fullWidth withRowGap>
          <Column sm={4} md={8} lg={10}>
            <AnalyticsPanel
              snapshot={snapshot}
              activeRate={activeRate}
              baptismRate={baptismRate}
              loading={isLoading}
            />
          </Column>
          <Column sm={4} md={8} lg={6}>
            <NotificationsPanel snapshot={snapshot} loading={isLoading} />
          </Column>
        </Grid>

        
        <Grid className="dashboard-carbon-grid" fullWidth withRowGap>
          <Column sm={4} md={8} lg={16}>
            <EventIntelligencePanel
              eventSnapshot={eventSnapshot}
              upcomingEvents={upcomingEvents}
              todayEvents={todayEvents}
              volunteerShortages={eventVolunteerShortages}
              pendingApprovals={pendingEventApprovals}
              loading={isLoading}
            />
          </Column>
        </Grid>

        
        <Grid className="dashboard-carbon-grid" fullWidth withRowGap>
          <Column sm={4} md={8} lg={8}>
            <MinistryEngagementPanel snapshot={snapshot} loading={isLoading} />
          </Column>
          <Column sm={4} md={8} lg={8}>
            <CellGroupHealthPanel snapshot={snapshot} loading={isLoading} />
          </Column>
        </Grid>
      </Stack>
    </Stack>
  );
}
