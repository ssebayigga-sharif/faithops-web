import type { ReactNode } from "react";
import type { CarbonIconType } from "@carbon/icons-react";
import type {
  AttendanceRecord,
  FollowUpTask,
  Member,
  Ministry,
} from "./memberTypes";

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
  serviceType: AttendanceRecord["serviceType"];
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
