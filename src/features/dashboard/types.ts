import type { ReactNode } from "react";
import type { CarbonIconType } from "@carbon/icons-react";
import type { Member, FollowUpTask, MemberAttendanceRecord, Ministry } from "../members/types";
import type { ChurchEvent, EventAnalyticsSnapshot } from "../events/types";

export type DashboardTagType =
  | "green"
  | "blue"
  | "cyan"
  | "gray"
  | "red"
  | "purple"
  | "magenta";

export type InsightStatus = "critical" | "warning" | "healthy" | "info";

export interface MetricCardProps {
  label: string;
  value: string;
  meta: string;
  accent: string;
  loading?: boolean;
}

export interface DashboardPanelProps {
  title: string;
  description: string;
  icon?: CarbonIconType;
  tagLabel?: string;
  tagType?: DashboardTagType;
  children: ReactNode;
}

export interface InsightItemProps {
  icon: CarbonIconType;
  title: string;
  description: string;
  status: InsightStatus;
  actionLabel?: string;
}

export interface ProgressRowProps {
  label: string;
  value: string;
  percent: number;
}

export interface OperationsRowProps {
  title: string;
  description: string;
  tag: string;
  tagType: DashboardTagType;
}

export interface FollowUpWithMember extends FollowUpTask {
  memberId: string;
  memberName: string;
}

export interface ServiceAttendance {
  date: string;
  present: number;
  total: number;
  serviceType: MemberAttendanceRecord["serviceType"];
}

export interface MinistryEngagement {
  ministry: Ministry;
  count: number;
  percent: number;
}

export interface CellGroupHealth {
  cellGroup: string;
  count: number;
  average: number;
}

export interface DashboardSnapshot {
  activeMembers: number;
  attendanceAverage: number;
  baptized: number;
  cellGroupHealth: CellGroupHealth[];
  dueSoonFollowUps: FollowUpWithMember[];
  givingTotal: number;
  lowAttendanceMembers: Member[];
  ministryEngagement: MinistryEngagement[];
  monthlyGiving: number;
  newConverts: number;
  overdueFollowUps: FollowUpWithMember[];
  pendingFollowUps: FollowUpWithMember[];
  presentRecords: number;
  serviceAttendance: ServiceAttendance[];
  totalAttendanceRecords: number;
  totalMembers: number;
  visitors: number;
}

export interface UseDashboardSnapshotReturn {
  snapshot: DashboardSnapshot;
  activeRate: number;
  baptismRate: number;
  attendanceCoverage: number;
  eventSnapshot: EventAnalyticsSnapshot;
  upcomingEvents: ChurchEvent[];
  todayEvents: ChurchEvent[];
  eventVolunteerShortages: ChurchEvent[];
  pendingEventApprovals: ChurchEvent[];
  isLoading: boolean;
  isError: boolean;
  error: string | null | undefined;
  refetch: () => void;
}
