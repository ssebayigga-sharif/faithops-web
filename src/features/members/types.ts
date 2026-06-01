import type { UseQueryResult } from "@tanstack/react-query";
import type { Gender, MaritalStatus } from "@/shared/types";

export type MemberStatus =
  | "active"
  | "visitor"
  | "New convert"
  | "Inactive"
  | "Transfered"
  | "Suspended"
  | "Deceased";

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

export interface MinistryAssignment {
  ministry: Ministry;
  role: MinistryRole;
  joinedAt: string;
  active: boolean;
}

export interface FamilyLink {
  memberId: string | null;
  name: string;
  relation: "Spouse" | "Son" | "Daughter" | "Parent" | "Guardian";
  phone?: string;
  isEmergencyContact: boolean;
}

export interface MemberAttendanceRecord {
  date: string;
  serviceType: "Sunday" | "Midweek" | "Special";
  present: boolean;
}

export interface MemberGivingRecord {
  month: string;
  amount: number;
  type: "Tithe" | "Offering" | "Donation";
}

export interface FollowUpTask {
  id: string;
  task: string;
  status: FollowUpStatus;
  assignedTo: string;
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

export interface MemberTimelineEvent {
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

export interface Member {
  _firebaseKey?: string;
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  maritalStatus: MaritalStatus;
  phone: string;
  email: string;
  photo?: string;
  status: MemberStatus;
  baptized: boolean;
  joinedAt: string;
  cellGroup: string;
  ministries: MinistryAssignment[];
  family: FamilyLink[];
  attendance: MemberAttendanceRecord[];
  giving: MemberGivingRecord[];
  followUps: FollowUpTask[];
  notes: StaffNote[];
  timeline: MemberTimelineEvent[];
  _computed?: MemberComputed;
}

export interface MemberComputed {
  fullName: string;
  initials: string;
  attendanceRate: number;
  consecutiveMisses: number;
  lastAttended: string | null;
  totalGiving: number;
  monthlyAvgGiving: number;
}

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

export interface MiniAssignmentDraft {
  ministry: Ministry;
  role: MinistryRole;
}

export type Step = 0 | 1 | 2;

export interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (member: Member) => void | Promise<void>;
  existingIds: string[];
  isSubmitting?: boolean;
}

export type MemberFormValues = Pick<
  Member,
  | "firstName"
  | "lastName"
  | "gender"
  | "age"
  | "maritalStatus"
  | "phone"
  | "email"
  | "status"
  | "baptized"
  | "joinedAt"
  | "cellGroup"
>;

export interface UseMembersResult {
  members: Member[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: UseQueryResult<Member[], unknown>["refetch"];
}

export interface UseCreateMemberResult {
  createMember: (
    member: Omit<Member, "_computed" | "_firebaseKey">,
  ) => Promise<Member>;
  isCreating: boolean;
  createError: string | null;
}

export interface UseUpdateMemberResult {
  updateMember: (params: {
    firebaseKey: string;
    member: Omit<Member, "_computed" | "_firebaseKey">;
  }) => Promise<Member>;
  isUpdating: boolean;
  updateError: string | null;
}

export interface UseDeleteMemberResult {
  deleteMember: (firebaseKey: string) => Promise<void>;
  isDeleting: boolean;
}
