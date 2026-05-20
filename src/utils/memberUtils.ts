import type {
  Member,
  MemberComputed,
  MemberFilters,
  SortState,
  MemberStatus,
  Ministry,
  MinistryRole,
} from "../churchTypes/memberTypes";

// ─── Compute derived fields ───────────────────────────────────────────────────

export function computeMember(member: Member): Member {
  const attendance = Array.isArray(member.attendance) ? member.attendance : [];
  const giving = Array.isArray(member.giving) ? member.giving : [];
  const ministries = Array.isArray(member.ministries) ? member.ministries : [];
  const family = Array.isArray(member.family) ? member.family : [];
  const followUps = Array.isArray(member.followUps) ? member.followUps : [];
  const notes = Array.isArray(member.notes) ? member.notes : [];
  const timeline = Array.isArray(member.timeline) ? member.timeline : [];
  const firstName = member.firstName ?? "";
  const lastName = member.lastName ?? "";

  const total = attendance.length;
  const present = attendance.filter((a) => a.present).length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  // Count consecutive misses from most recent backwards
  const sorted = [...attendance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let consecutiveMisses = 0;
  for (const rec of sorted) {
    if (!rec.present) consecutiveMisses++;
    else break;
  }

  const lastPresent = sorted.find((a) => a.present);
  const lastAttended = lastPresent?.date ?? null;

  const totalGiving = giving.reduce((sum, g) => sum + g.amount, 0);
  const uniqueMonths = new Set(giving.map((g) => g.month)).size;
  const monthlyAvgGiving =
    uniqueMonths > 0 ? Math.round(totalGiving / uniqueMonths) : 0;

  const computed: MemberComputed = {
    fullName: `${firstName} ${lastName}`,
    initials: `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase(),
    attendanceRate,
    consecutiveMisses,
    lastAttended,
    totalGiving,
    monthlyAvgGiving,
  };

  return {
    ...member,
    firstName,
    lastName,
    attendance,
    giving,
    ministries,
    family,
    followUps,
    notes,
    timeline,
    _computed: computed,
  };
}

export function computeMembers(members: Member[]): Member[] {
  return members.map(computeMember);
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export function filterMembers(
  members: Member[],
  filters: MemberFilters
): Member[] {
  return members.filter((m) => {
    const fullName = m._computed?.fullName ?? `${m.firstName} ${m.lastName}`;

    if (
      filters.search &&
      !fullName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !m.id.toLowerCase().includes(filters.search.toLowerCase()) &&
      !m.phone.includes(filters.search)
    ) {
      return false;
    }

    if (filters.status && m.status !== filters.status) return false;

    if (
      filters.ministry &&
      !m.ministries.some(
        (mn) => mn.ministry === filters.ministry && mn.active
      )
    ) {
      return false;
    }

    if (filters.gender && m.gender !== filters.gender) return false;

    if (filters.baptized === "yes" && !m.baptized) return false;
    if (filters.baptized === "no" && m.baptized) return false;

    if (filters.cellGroup && m.cellGroup !== filters.cellGroup) return false;

    if (filters.attendance) {
      const rate = m._computed?.attendanceRate ?? 0;
      if (filters.attendance === "high" && rate < 75) return false;
      if (filters.attendance === "medium" && (rate < 40 || rate >= 75))
        return false;
      if (filters.attendance === "low" && (rate < 1 || rate >= 40))
        return false;
      if (filters.attendance === "missing" && rate !== 0) return false;
    }

    return true;
  });
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

export function sortMembers(members: Member[], sort: SortState): Member[] {
  return [...members].sort((a, b) => {
    let valA: string | number = 0;
    let valB: string | number = 0;

    switch (sort.field) {
      case "fullName":
        valA = a._computed?.fullName ?? "";
        valB = b._computed?.fullName ?? "";
        break;
      case "status":
        valA = a.status;
        valB = b.status;
        break;
      case "attendanceRate":
        valA = a._computed?.attendanceRate ?? 0;
        valB = b._computed?.attendanceRate ?? 0;
        break;
      case "lastAttended":
        valA = a._computed?.lastAttended ?? "";
        valB = b._computed?.lastAttended ?? "";
        break;
      case "joinedAt":
        valA = a.joinedAt;
        valB = b.joinedAt;
        break;
    }

    if (valA < valB) return sort.dir === "asc" ? -1 : 1;
    if (valA > valB) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export function formatUGX(amount: number): string {
  return `UGX ${new Intl.NumberFormat("en-UG").format(amount)}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function getStatusColor(
  status: MemberStatus
): "green" | "blue" | "cyan" | "gray" | "red" | "purple" | "magenta" {
  const map: Record<MemberStatus, "green" | "blue" | "cyan" | "gray" | "red" | "purple" | "magenta"> = {
    active: "green",
    visitor: "blue",
    "New convert": "cyan",
    Inactive: "gray",
    Transfered: "purple",
    Suspended: "red",
    Deceased: "magenta",
  };
  return map[status];
}

export function getAttendanceColor(
  rate: number
): "green" | "teal" | "yellow" | "red" {
  if (rate >= 75) return "green";
  if (rate >= 40) return "teal";
  if (rate >= 1) return "yellow";
  return "red";
}

// ─── Generate member ID ───────────────────────────────────────────────────────

export function generateMemberId(existingIds: string[]): string {
  const nums = existingIds
    .map((id) => parseInt(id.replace("KSC-", ""), 10))
    .filter(Boolean);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `KSC-${String(next).padStart(4, "0")}`;
}

export const CELL_GROUPS = [
  "Nakawa",
  "Kololo",
  "Ntinda",
  "Kireka",
  "Bugolobi",
  "Luzira",
  "Muyenga",
];

export const MINISTRIES_LIST:  Ministry[] = [
  "Choir",
  "Media",
  "Ushering",
  "Youth",
  "Prayer",
  "Children",
  "Evangelism",
];

export const MINISTRY_ROLES: MinistryRole[] = [
  "Member",
  "Section Lead",
  "Team Lead",
  "Mentor",
  "Intercessor",
  "Teacher",
  "Camera",
];
