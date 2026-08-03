import type {
  ServiceType as SharedServiceType,
  AttendanceStatus as SharedAttendanceStatus,
} from "../../shared/types";

// Re-export shared types for local convenience
export type AttendanceStatus = SharedAttendanceStatus;
export type ServiceType = SharedServiceType;

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  serviceType: ServiceType;
  status: AttendanceStatus;
  notes: string;
  markedBy: string;
  createdAt: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  serviceType: ServiceType;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  totalVisitors: number;
  ministryCounts?: Record<string, number>;
  createdAt: string;
}

export interface AttendanceMember {
  uid: string;
  firstName: string;
  lastName: string;
  department: string;
  membershipStatus: string;
  profilePhotoUrl?: string;
}

export interface AttendanceRow {
  memberId: string;
  memberName: string;
  department: string;
  status: AttendanceStatus;
  notes: string;
}

export interface VisitorRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  serviceType: ServiceType;
  visitedBy: string;
  notes: string;
  followUpStatus: "pending" | "contacted" | "converted" | "no_interest";
  createdAt: string;
}

export interface AttendanceStats {
  totalSessions: number;
  averageAttendance: number;
  presentRate: number;
  lateRate: number;
  absentRate: number;
  excusedRate: number;
  totalVisitors: number;
  trend: { date: string; present: number; total: number; visitors: number }[];
  ministryBreakdown?: { ministry: string; count: number; percent: number }[];
}

export interface BulkSavePayload {
  date: string;
  serviceType: ServiceType;
  rows: AttendanceRow[];
  visitors: VisitorRowPayload[];
  markedBy: string;
}

export interface VisitorRowPayload {
  name: string;
  phone: string;
  email?: string;
  notes: string;
}
