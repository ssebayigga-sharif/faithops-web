import { useMemo } from "react";
import type { ChurchEvent, EventAnalyticsSnapshot } from "../../events/types";
import type { DashboardSnapshot, UseDashboardSnapshotReturn } from "../types";
import { useMembers } from "../../members/hooks/useMember";
import { useEvents } from "../../events/hooks/useEvent";
import {
  buildEventAnalyticsSnapshot,
  getUpcomingEvents,
} from "../../events/eventUtils";
import {
  asList,
  buildDashboardSnapshot,
  percentage,
} from "../components/dashboardSelectors";

export function useDashboardSnapshot(): UseDashboardSnapshotReturn {
  const {
    members,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
    refetch: refetchMembers,
  } = useMembers();
  const {
    events,
    isLoading: isEventsLoading,
    isError: isEventsError,
    error: eventsError,
    refetch: refetchEvents,
  } = useEvents();

  const snapshot = useMemo(
    () => buildDashboardSnapshot(asList(members)),
    [members],
  );
  const eventList = asList(events);
  const eventSnapshot = useMemo(
    () => buildEventAnalyticsSnapshot(eventList),
    [eventList],
  );
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(eventList).slice(0, 5),
    [eventList],
  );
  const todayEvents = useMemo(() => {
    const today = new Date();
    return eventList.filter((event) => {
      const start = new Date(event.start);
      return (
        start.getFullYear() === today.getFullYear() &&
        start.getMonth() === today.getMonth() &&
        start.getDate() === today.getDate()
      );
    });
  }, [eventList]);
  const eventVolunteerShortages = useMemo(
    () =>
      eventList
        .filter(
          (event) =>
            event.status === "Needs volunteers" ||
            event.volunteers.some((volunteer) => volunteer.status === "Needed"),
        )
        .slice(0, 5),
    [eventList],
  );
  const pendingEventApprovals = useMemo(
    () =>
      eventList
        .filter((event) => event.status === "Pending approval")
        .slice(0, 5),
    [eventList],
  );

  const activeRate = useMemo(
    () => percentage(snapshot.activeMembers, snapshot.totalMembers),
    [snapshot.activeMembers, snapshot.totalMembers],
  );

  const baptismRate = useMemo(
    () => percentage(snapshot.baptized, snapshot.totalMembers),
    [snapshot.baptized, snapshot.totalMembers],
  );

  const attendanceCoverage = useMemo(
    () => percentage(snapshot.presentRecords, snapshot.totalAttendanceRecords),
    [snapshot.presentRecords, snapshot.totalAttendanceRecords],
  );

  return {
    snapshot,
    eventSnapshot,
    upcomingEvents,
    todayEvents,
    eventVolunteerShortages,
    pendingEventApprovals,
    activeRate,
    baptismRate,
    attendanceCoverage,
    isLoading: isMembersLoading || isEventsLoading,
    isError: isMembersError || isEventsError,
    error: membersError ?? eventsError,
    refetch: () => {
      void refetchMembers();
      void refetchEvents();
    },
  };
}
