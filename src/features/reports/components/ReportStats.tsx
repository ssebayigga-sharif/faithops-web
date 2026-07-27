import { useMemo } from "react";
import type {
  AttendanceSession,
  AttendanceMember,
  VisitorRecord,
} from "@/features/attendance/types";

export interface ReportStats {
  totalSessions: number;
  totalMembers: number;
  totalVisitors: number;
  presentRate: number;
  absentRate: number;
  lateRate: number;
  averageAttendance: number;
  byService: Record<string, { present: number; total: number }>;
  monthly: Array<{
    month: string;
    present: number;
    total: number;
    rate: number;
  }>;
  followUpNeeded: number;
}

export function useReportStats(
  sessions: AttendanceSession[],
  members: any[],
  followUpCandidates: any[],
  visitors: VisitorRecord[],
) {
  return useMemo<ReportStats | null>(() => {
    const total = sessions.length;
    if (total === 0) return null;

    const totalPresent = sessions.reduce((s, ses) => s + ses.totalPresent, 0);
    const totalAbsent = sessions.reduce((s, ses) => s + ses.totalAbsent, 0);
    const totalLate = sessions.reduce((s, ses) => s + ses.totalLate, 0);
    const totalExcused = sessions.reduce((s, ses) => s + ses.totalExcused, 0);
    const totalVisitors = sessions.reduce(
      (s, ses) => s + (ses.totalVisitors ?? 0),
      0,
    );
    const grandTotal = totalPresent + totalAbsent + totalLate + totalExcused;

    const presentRate = grandTotal
      ? Math.round((totalPresent / grandTotal) * 100)
      : 0;
    const averageAttendance = Math.round(totalPresent / total);

    const byService: Record<string, { present: number; total: number }> = {};
    sessions.forEach((ses) => {
      if (!byService[ses.serviceType]) {
        byService[ses.serviceType] = { present: 0, total: 0 };
      }
      byService[ses.serviceType].present += ses.totalPresent;
      byService[ses.serviceType].total +=
        ses.totalPresent + ses.totalAbsent + ses.totalLate + ses.totalExcused;
    });

    const monthly: Record<string, { present: number; total: number }> = {};
    sessions.forEach((ses) => {
      const month = ses.date.slice(0, 7);
      if (!monthly[month]) {
        monthly[month] = { present: 0, total: 0 };
      }
      monthly[month].present += ses.totalPresent;
      monthly[month].total +=
        ses.totalPresent + ses.totalAbsent + ses.totalLate + ses.totalExcused;
    });

    return {
      totalSessions: total,
      totalMembers: members.length,
      totalVisitors,
      presentRate,
      absentRate: grandTotal ? Math.round((totalAbsent / grandTotal) * 100) : 0,
      lateRate: grandTotal ? Math.round((totalLate / grandTotal) * 100) : 0,
      averageAttendance,
      byService,
      monthly: Object.entries(monthly)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          present: data.present,
          total: data.total,
          rate: data.total ? Math.round((data.present / data.total) * 100) : 0,
        })),
      followUpNeeded: followUpCandidates.length,
    };
  }, [sessions, members, followUpCandidates, visitors]);
}
