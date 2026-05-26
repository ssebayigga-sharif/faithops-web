export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type ServiceType =
  | "Sabbath Programmes"
  | "Wednesday Fellowship"
  | "Friday Prayer"
  | "Prayer and Fasting"
  | "Special Event";

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // ISO date: "2024-06-02"
  serviceType: ServiceType;
  status: AttendanceStatus;
  notes: string;
  markedBy: string;
  createdAt: string;
}

export interface AttendanceSession {
  id: string; // "{date}_{serviceType}" slugified
  date: string;
  serviceType: ServiceType;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  createdAt: string;
}

export interface Member {
  uid: string;
  firstName: string;
  lastName: string;
  department: string;
  membershipStatus: string;
  profilePhotoUrl?: string;
}

/** Shape of a single row in the bulk-mark table */
export interface AttendanceRow {
  memberId: string;
  memberName: string;
  department: string;
  status: AttendanceStatus;
  notes: string;
}

export interface AttendanceStats {
  totalSessions: number;
  averageAttendance: number;
  presentRate: number;
  lateRate: number;
  absentRate: number;
  excusedRate: number;
  trend: { date: string; present: number; total: number }[];
}
