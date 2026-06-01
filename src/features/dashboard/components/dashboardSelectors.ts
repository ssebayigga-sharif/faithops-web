import type {
  CellGroupHealth,
  DashboardSnapshot,
  FollowUpWithMember,
  MinistryEngagement,
  ServiceAttendance,
} from "@/features/dashboard/types";
import type {
  FollowUpTask,
  Member,
  MemberAttendanceRecord,
  MemberGivingRecord,
  MinistryAssignment,
} from "@/features/members/types";
import { CELL_GROUPS, MINISTRIES_LIST, formatDate } from "@/features/members/utils/memberUtils";

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_SERVICES_COUNT = 6;
const LOW_ATTENDANCE_THRESHOLD = 45;
const CONSECUTIVE_MISS_THRESHOLD = 2;
const DUE_SOON_DAYS = 7;
const TOP_N = 5;

// ─── Safe accessors ──────────────────────────────────────────────────────────

export function asList<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function getMemberName(member: Member): string {
  return (
    member._computed?.fullName ??
    `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim()
  );
}

export function getAttendanceRecords(member: Member): MemberAttendanceRecord[] {
  return asList(member.attendance);
}

export function getGivingRecords(member: Member): MemberGivingRecord[] {
  return asList(member.giving);
}

export function getFollowUpTasks(member: Member): FollowUpTask[] {
  return asList(member.followUps);
}

export function getMinistryAssignments(member: Member): MinistryAssignment[] {
  return asList(member.ministries);
}

// ─── Computed member metrics ─────────────────────────────────────────────────

export function percentage(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

export function getAttendanceRate(member: Member): number {
  if (typeof member._computed?.attendanceRate === "number") {
    return member._computed.attendanceRate;
  }
  const records = getAttendanceRecords(member);
  return percentage(records.filter((r) => r.present).length, records.length);
}

export function getConsecutiveMisses(member: Member): number {
  if (typeof member._computed?.consecutiveMisses === "number") {
    return member._computed.consecutiveMisses;
  }
  let misses = 0;
  const sorted = [...getAttendanceRecords(member)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  for (const record of sorted) {
    if (record.present) break;
    misses += 1;
  }
  return misses;
}

export function getTotalGiving(member: Member): number {
  return (
    member._computed?.totalGiving ??
    getGivingRecords(member).reduce((sum, g) => sum + g.amount, 0)
  );
}

// ─── Follow-up predicates ─────────────────────────────────────────────────────

function isOverdue(task: FollowUpTask, today: Date): boolean {
  if (task.status === "done") return false;
  const dueTime = new Date(task.dueDate).getTime();
  return Number.isFinite(dueTime) && dueTime < today.getTime();
}

function isDueSoon(task: FollowUpTask, today: Date): boolean {
  if (task.status === "done") return false;
  const dueTime = new Date(task.dueDate).getTime();
  if (!Number.isFinite(dueTime)) return false;
  const daysUntilDue = Math.ceil((dueTime - today.getTime()) / DAY_MS);
  return daysUntilDue >= 0 && daysUntilDue <= DUE_SOON_DAYS;
}

function getCurrentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

// ─── Focused selectors (each independently testable) ─────────────────────────

export function selectMembershipCounts(members: Member[]) {
  return {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === "active").length,
    visitors: members.filter((m) => m.status === "visitor").length,
    newConverts: members.filter((m) => m.status === "New convert").length,
    baptized: members.filter((m) => m.baptized).length,
  };
}

export function selectAttendanceMetrics(members: Member[]) {
  const records = members.flatMap(getAttendanceRecords);
  const presentRecords = records.filter((r) => r.present).length;
  const attendanceAverage =
    members.length > 0
      ? Math.round(
          members.reduce((sum, m) => sum + getAttendanceRate(m), 0) /
            members.length,
        )
      : 0;

  const serviceAttendance: ServiceAttendance[] = Object.values(
    records.reduce<Record<string, ServiceAttendance>>((acc, record) => {
      const existing = acc[record.date] ?? {
        date: record.date,
        present: 0,
        total: 0,
        serviceType: record.serviceType,
      };
      existing.total += 1;
      existing.present += record.present ? 1 : 0;
      acc[record.date] = existing;
      return acc;
    }, {}),
  )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, RECENT_SERVICES_COUNT)
    .reverse();

  return {
    attendanceAverage,
    presentRecords,
    totalAttendanceRecords: records.length,
    serviceAttendance,
  };
}

export function selectGivingMetrics(members: Member[]) {
  const currentMonth = getCurrentMonthKey();
  return {
    givingTotal: members.reduce((sum, m) => sum + getTotalGiving(m), 0),
    monthlyGiving: members.reduce(
      (sum, m) =>
        sum +
        getGivingRecords(m)
          .filter((g) => g.month === currentMonth)
          .reduce((s, g) => s + g.amount, 0),
      0,
    ),
  };
}

export function selectFollowUpMetrics(members: Member[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const followUps: FollowUpWithMember[] = members.flatMap((m) =>
    getFollowUpTasks(m).map((task) => ({
      ...task,
      memberId: m.id,
      memberName: getMemberName(m),
    })),
  );

  return {
    overdueFollowUps: followUps.filter((t) => isOverdue(t, today)),
    dueSoonFollowUps: followUps.filter((t) => isDueSoon(t, today)),
    pendingFollowUps: followUps.filter((t) => t.status !== "done"),
  };
}

export function selectLowAttendanceMembers(members: Member[]): Member[] {
  return members
    .filter(
      (m) =>
        getAttendanceRate(m) < LOW_ATTENDANCE_THRESHOLD ||
        getConsecutiveMisses(m) >= CONSECUTIVE_MISS_THRESHOLD,
    )
    .sort((a, b) => {
      const missDelta = getConsecutiveMisses(b) - getConsecutiveMisses(a);
      return missDelta || getAttendanceRate(a) - getAttendanceRate(b);
    })
    .slice(0, TOP_N);
}

export function selectMinistryEngagement(
  members: Member[],
): MinistryEngagement[] {
  return MINISTRIES_LIST.map((ministry) => {
    const count = members.filter((m) =>
      getMinistryAssignments(m).some(
        (a) => a.ministry === ministry && a.active,
      ),
    ).length;
    return { ministry, count, percent: percentage(count, members.length) };
  })
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N);
}

export function selectCellGroupHealth(members: Member[]): CellGroupHealth[] {
  return CELL_GROUPS.map((cellGroup) => {
    const groupMembers = members.filter((m) => m.cellGroup === cellGroup);
    const average = groupMembers.length
      ? Math.round(
          groupMembers.reduce((sum, m) => sum + getAttendanceRate(m), 0) /
            groupMembers.length,
        )
      : 0;
    return { cellGroup, count: groupMembers.length, average };
  })
    .filter((g) => g.count > 0)
    .sort((a, b) => b.average - a.average)
    .slice(0, TOP_N);
}

// ─── Composed snapshot ────────────────────────────────────────────────────────

export function buildDashboardSnapshot(members: Member[]): DashboardSnapshot {
  return {
    ...selectMembershipCounts(members),
    ...selectAttendanceMetrics(members),
    ...selectGivingMetrics(members),
    ...selectFollowUpMetrics(members),
    lowAttendanceMembers: selectLowAttendanceMembers(members),
    ministryEngagement: selectMinistryEngagement(members),
    cellGroupHealth: selectCellGroupHealth(members),
  };
}
