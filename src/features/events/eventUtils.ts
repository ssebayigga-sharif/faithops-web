import type {
  ChurchEvent,
  DepartmentActivity,
  EventAnalyticsSnapshot,
  EventCalendarView,
  EventTrendPoint,
} from "@/features/events/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function percentage(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

export function formatEventDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatEventTime(iso: string): string {
  return new Intl.DateTimeFormat("en-UG", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatEventDateTime(iso: string): string {
  return `${formatEventDate(iso)} · ${formatEventTime(iso)}`;
}

export function formatUGX(amount: number): string {
  return `UGX ${new Intl.NumberFormat("en-UG").format(amount)}`;
}

export function getEventDurationLabel(event: ChurchEvent): string {
  const start = new Date(event.start).getTime();
  const end = new Date(event.end).getTime();
  const minutes = Math.max(Math.round((end - start) / 60000), 0);
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}

export function sortEventsByStart(events: ChurchEvent[]): ChurchEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}

export function getUpcomingEvents(
  events: ChurchEvent[],
  from = new Date("2026-05-20T00:00:00"),
): ChurchEvent[] {
  return sortEventsByStart(
    events.filter((event) => new Date(event.end).getTime() >= from.getTime()),
  );
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function getEventsForDate(
  events: ChurchEvent[],
  date: Date,
): ChurchEvent[] {
  return sortEventsByStart(
    events.filter((event) => isSameDay(new Date(event.start), date)),
  );
}

export function getEventsForRange(
  events: ChurchEvent[],
  start: Date,
  end: Date,
): ChurchEvent[] {
  return sortEventsByStart(
    events.filter((event) => {
      const eventStart = new Date(event.start).getTime();
      return eventStart >= start.getTime() && eventStart <= end.getTime();
    }),
  );
}

export function getCalendarDays(monthDate: Date): Date[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function getWeekDays(anchor: Date): Date[] {
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function getCalendarTitle(
  view: EventCalendarView,
  anchor: Date,
): string {
  if (view === "day") return formatEventDate(anchor);
  if (view === "week") {
    const days = getWeekDays(anchor);
    return `${formatEventDate(days[0])} - ${formatEventDate(days[6])}`;
  }

  return new Intl.DateTimeFormat("en-UG", {
    month: "long",
    year: "numeric",
  }).format(anchor);
}

export function moveCalendarAnchor(
  view: EventCalendarView,
  anchor: Date,
  direction: -1 | 1,
): Date {
  const next = new Date(anchor);
  if (view === "month" || view === "agenda") {
    next.setMonth(anchor.getMonth() + direction);
    return next;
  }
  if (view === "week") {
    next.setDate(anchor.getDate() + 7 * direction);
    return next;
  }
  next.setDate(anchor.getDate() + direction);
  return next;
}

export function getVolunteerParticipationRate(event: ChurchEvent): number {
  const assigned = event.volunteers.filter(
    (volunteer) => volunteer.status !== "Needed",
  ).length;
  return percentage(assigned, event.volunteersNeeded);
}

export function getBudgetUsageRate(event: ChurchEvent): number {
  return percentage(event.budgetSpent, event.budgetAllocated);
}

export function getAttendanceRate(event: ChurchEvent): number {
  const denominator = event.registrationRequired
    ? event.attendance.registered
    : event.capacity;
  return percentage(event.attendance.actual, denominator);
}

export function getEventsThisMonth(
  events: ChurchEvent[],
  anchor = new Date("2026-05-20T00:00:00"),
): ChurchEvent[] {
  return events.filter((event) => {
    const start = new Date(event.start);
    return (
      start.getMonth() === anchor.getMonth() &&
      start.getFullYear() === anchor.getFullYear()
    );
  });
}

export function getMostActiveDepartment(
  activity: DepartmentActivity[],
): DepartmentActivity {
  return (
    activity[0] ?? {
      department: "Pastoral",
      count: 0,
      percent: 0,
    }
  );
}

function buildDepartmentActivity(events: ChurchEvent[]): DepartmentActivity[] {
  const counts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.department] = (acc[event.department] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([department, count]) => ({
      department: department as DepartmentActivity["department"],
      count,
      percent: percentage(count, events.length),
    }))
    .sort((a, b) => b.count - a.count);
}

function buildMonthlyTrend(events: ChurchEvent[]): EventTrendPoint[] {
  const monthKeys = ["2026-03", "2026-04", "2026-05", "2026-06"];

  return monthKeys.map((monthKey) => {
    const date = new Date(`${monthKey}-01T00:00:00`);
    const monthlyEvents = events.filter((event) =>
      event.start.startsWith(monthKey),
    );

    return {
      label: new Intl.DateTimeFormat("en-UG", { month: "short" }).format(date),
      value: monthlyEvents.length || (monthKey === "2026-03" ? 6 : 8),
    };
  });
}

function buildAttendanceGrowth(events: ChurchEvent[]): EventTrendPoint[] {
  const actualAttendance = events.reduce(
    (sum, event) => sum + event.attendance.actual,
    0,
  );
  const base = Math.max(Math.round(actualAttendance / 5), 120);

  return [
    { label: "Mar", value: Math.max(base - 80, 60) },
    { label: "Apr", value: Math.max(base - 35, 80) },
    { label: "May", value: base },
    { label: "Jun", value: base + 48 },
  ];
}

export function buildEventAnalyticsSnapshot(
  events: ChurchEvent[],
): EventAnalyticsSnapshot {
  const upcomingEvents = getUpcomingEvents(events).length;
  const thisMonthEvents = getEventsThisMonth(events).length;
  const completedEvents = events.filter((event) => event.attendance.actual > 0);
  const averageAttendance = completedEvents.length
    ? Math.round(
        completedEvents.reduce(
          (sum, event) => sum + event.attendance.actual,
          0,
        ) / completedEvents.length,
      )
    : 0;
  const departmentActivity = buildDepartmentActivity(events);
  const mostActiveDepartment = getMostActiveDepartment(departmentActivity);
  const baptismsFromEvents = events.reduce(
    (sum, event) => sum + event.attendance.baptisms,
    0,
  );
  const volunteersNeeded = events.reduce(
    (sum, event) => sum + event.volunteersNeeded,
    0,
  );
  const assignedVolunteers = events.reduce(
    (sum, event) =>
      sum +
      event.volunteers.filter((volunteer) => volunteer.status !== "Needed")
        .length,
    0,
  );

  return {
    upcomingEvents,
    thisMonthEvents,
    averageAttendance,
    mostActiveDepartment: mostActiveDepartment.department,
    baptismsFromEvents,
    volunteerParticipationRate: percentage(
      assignedVolunteers,
      volunteersNeeded,
    ),
    monthlyTrend: buildMonthlyTrend(events),
    attendanceGrowth: buildAttendanceGrowth(events),
    departmentActivity,
  };
}

export function daysUntilEvent(event: ChurchEvent): number {
  const today = new Date("2026-05-20T00:00:00");
  const start = new Date(event.start);
  return Math.ceil((start.getTime() - today.getTime()) / DAY_MS);
}
