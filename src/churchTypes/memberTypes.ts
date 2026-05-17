// member types

export type MemberStatus =
  | "active"
  | "visitor"
  | "New convert"
  | "Inactive"
  | "Transfered"
  | "Suspended"
  | "Deceased";

export type Gender = "male" | "Female";

export type MaritalStatus = "Maried" | "Single";

export type MinistryRole =
  | "Member"
  | "Section Lead"
  | "Team Lead"
  | "Mentor"
  | "Intercessor"
  | "Teacher"
  | "Camera";

export type Ministry =
  | "Choir"
  | "Media"
  | "Ushering"
  | "Youth"
  | "Prayer"
  | "Children"
  | "Evangelism";

export type FollowUpStatus = "pending" | "done" | "overdue";

export type DrawerTab =
  | "overview"
  | "attendance"
  | "giving"
  | "family"
  | "ministries"
  | "followup"
  | "notes"
  | "timeline";

// ─── Sub-models ──────────────────────────────────────────────────────────────

export interface MinistryAssignment {
  ministry: Ministry;
  role: MinistryRole;
  joinedAt: string; // ISO date string
  active: boolean;
}

export interface FamilyLink {
  memberId: string | null; // null if not a registered member
  name: string;
  relation: "Spouse" | "Son" | "Daughter" | "Parent" | "Guardian";
  phone?: string;
  isEmergencyContact: boolean;
}

export interface AttendanceRecord {
  date: string; // ISO date string
  serviceType: "Sunday" | "Midweek" | "Special";
  present: boolean;
}

export interface GivingRecord {
  month: string; // e.g. "2025-01"
  amount: number; // in UGX
  type: "Tithe" | "Offering" | "Donation";
}

export interface FollowUpTask {
  id: string;
  task: string;
  status: FollowUpStatus;
  assignedTo: string; // staff name or UID
  dueDate: string;
  completedAt?: string;
}

export interface StaffNote {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  createdAt: string;
  private: boolean;
}

export interface TimelineEvent {
  id: string;
  type:
    | "joined"
    | "baptized"
    | "ministry"
    | "followup"
    | "note"
    | "attendance"
    | "giving";
  description: string;
  date: string;
}

// ─── Core Member model ───────────────────────────────────────────────────────

export interface Member {
  id: string; // e.g. "GCC-001"
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  maritalStatus: MaritalStatus;
  phone: string;
  email: string;
  photo?: string; // URL or null
  status: MemberStatus;
  baptized: boolean;
  joinedAt: string;

  // Relationships
  cellGroup: string;
  ministries: MinistryAssignment[];
  family: FamilyLink[];

  // Operational
  attendance: AttendanceRecord[];
  giving: GivingRecord[];
  followUps: FollowUpTask[];
  notes: StaffNote[];
  timeline: TimelineEvent[];

  // Computed (derived client-side, never stored)
  _computed?: MemberComputed;
}

// ─── Computed fields (derived, never written to Firebase) ────────────────────

export interface MemberComputed {
  fullName: string;
  initials: string;
  attendanceRate: number; // 0–100
  consecutiveMisses: number;
  lastAttended: string | null;
  totalGiving: number;
  monthlyAvgGiving: number;
}

// ─── Filter + Sort state ─────────────────────────────────────────────────────

export type AttendanceFilter = "high" | "medium" | "low" | "missing" | "";

export interface MemberFilters {
  search: string;
  status: MemberStatus | "";
  ministry: Ministry | "";
  gender: Gender | "";
  baptized: "yes" | "no" | "";
  attendance: AttendanceFilter;
  cellGroup: string;
}

export type SortField =
  | "fullName"
  | "status"
  | "attendanceRate"
  | "lastAttended"
  | "joinedAt";
export type SortDir = "asc" | "desc";

export interface SortState {
  field: SortField;
  dir: SortDir;
}
