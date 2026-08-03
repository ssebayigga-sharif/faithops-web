import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { AttendanceService } from "../services/attendance.services";
import {
  syncAttendanceToMembers,
  detectFollowUpCandidates,
  createFollowUpTask,
} from "../services/sync.services";
import type {
  AttendanceRow,
  AttendanceStatus,
  BulkSavePayload,
  AttendanceStats,
  VisitorRecord,
} from "../types";
import type { FollowUpCandidate } from "../services/sync.services";
export const attendanceKeys = {
  sessions: ["attendance", "sessions"] as const,
  sessionRecords: (id: string) => ["attendance", "records", id] as const,
  memberRecords: (id: string) => ["attendance", "member", id] as const,
  visitors: ["attendance", "visitors"] as const,
  followUpCandidates: ["attendance", "followUpCandidates"] as const,
  events: ["events"] as const,
};
// Returns ALL members (not just active) so the attendance list matches the members page
export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { MemberService } =
        await import("../../members/services/member.services");
      const all = await MemberService.getAll();
      return all;
    },
    staleTime: 5 * 60 * 1000,
  });
}
export function useEvents() {
  return useQuery({
    queryKey: attendanceKeys.events,
    queryFn: async () => {
      const { EventService } =
        await import("../../events/services/event.services");
      const all = await EventService.getAll();
      return all;
    },
    staleTime: 5 * 60 * 1000,
  });
}
export function useSessions() {
  return useQuery({
    queryKey: attendanceKeys.sessions,
    queryFn: AttendanceService.getSessions,
  });
}
export function useSessionRecords(sessionId: string | null) {
  return useQuery({
    queryKey: attendanceKeys.sessionRecords(sessionId ?? ""),
    queryFn: () => AttendanceService.getSessionRecords(sessionId!),
    enabled: !!sessionId,
  });
}
export function useMemberRecords(memberId: string | null) {
  return useQuery({
    queryKey: attendanceKeys.memberRecords(memberId ?? ""),
    queryFn: () => AttendanceService.getMemberRecords(memberId!),
    enabled: !!memberId,
  });
}
export function useVisitors() {
  return useQuery({
    queryKey: attendanceKeys.visitors,
    queryFn: AttendanceService.getAllVisitors,
  });
}

export function useSessionVisitors(sessionId: string | null) {
  return useQuery({
    queryKey: [...attendanceKeys.visitors, sessionId],
    queryFn: () => AttendanceService.getSessionVisitors(sessionId!),
    enabled: !!sessionId,
  });
}
export function useBulkSaveAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BulkSavePayload) => {
      // 1. Save attendance data
      const session = await AttendanceService.bulkSave(payload);

      // 2. Sync attendance back to member profiles
      const sessionId = `${payload.date}_${payload.serviceType.replace(/\s+/g, "_").toLowerCase()}`;
      await syncAttendanceToMembers(
        sessionId,
        payload.date,
        payload.rows,
        payload.markedBy,
        payload.serviceType,
      );

      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.sessions });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.visitors });
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.followUpCandidates,
      });
      // Also invalidate members so computed fields update
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      AttendanceService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.sessions });
    },
  });
}
export function useFollowUpCandidates() {
  return useQuery({
    queryKey: attendanceKeys.followUpCandidates,
    queryFn: detectFollowUpCandidates,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateFollowUpTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      memberFirebaseKey: string;
      candidate: FollowUpCandidate;
      assignedTo?: string;
    }) =>
      createFollowUpTask(
        params.memberFirebaseKey,
        params.candidate,
        params.assignedTo,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.followUpCandidates,
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
export function useUpdateVisitorFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      sessionId: string;
      visitorId: string;
      status: VisitorRecord["followUpStatus"];
    }) =>
      AttendanceService.updateVisitorFollowUp(
        params.sessionId,
        params.visitorId,
        params.status,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.visitors });
    },
  });
}

/**
 * Builds attendance rows from a members list.
 * Includes ALL members (not just active) so the list matches the members page.
 * Recomputes every time members change so new members appear immediately.
 */
export function useAttendanceRows(
  members: {
    _firebaseKey?: string;
    firstName: string;
    lastName: string;
    department?: string;
    status: string;
  }[],
): AttendanceRow[] {
  return useMemo(
    () =>
      members.map((m) => ({
        memberId: m._firebaseKey ?? m.firstName,
        memberName: `${m.firstName} ${m.lastName}`,
        department: m.department ?? "",
        status: "absent" as AttendanceStatus,
        notes: "",
      })),
    [members],
  );
}

/**
 * Computes aggregate attendance statistics from all sessions.
 */
export function useAttendanceStats(
  sessions: {
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalExcused: number;
    totalVisitors?: number;
    date: string;
  }[],
): AttendanceStats {
  return useMemo(() => {
    const total = sessions.length;
    if (total === 0) {
      return {
        totalSessions: 0,
        averageAttendance: 0,
        presentRate: 0,
        lateRate: 0,
        absentRate: 0,
        excusedRate: 0,
        totalVisitors: 0,
        trend: [],
      };
    }

    const totalPresent = sessions.reduce((s, ses) => s + ses.totalPresent, 0);
    const totalLate = sessions.reduce((s, ses) => s + ses.totalLate, 0);
    const totalAbsent = sessions.reduce((s, ses) => s + ses.totalAbsent, 0);
    const totalExcused = sessions.reduce((s, ses) => s + ses.totalExcused, 0);
    const totalVisitors = sessions.reduce(
      (s, ses) => s + (ses.totalVisitors ?? 0),
      0,
    );
    const grandTotal = totalPresent + totalLate + totalAbsent + totalExcused;

    const presentRate = grandTotal
      ? Math.round((totalPresent / grandTotal) * 100)
      : 0;
    const lateRate = grandTotal
      ? Math.round((totalLate / grandTotal) * 100)
      : 0;
    const absentRate = grandTotal
      ? Math.round((totalAbsent / grandTotal) * 100)
      : 0;
    const excusedRate = grandTotal
      ? Math.round((totalExcused / grandTotal) * 100)
      : 0;

    // Per-session trend (last 10)
    const trend = sessions.slice(0, 10).map((ses) => {
      const sesTotal =
        ses.totalPresent + ses.totalAbsent + ses.totalLate + ses.totalExcused;
      return {
        date: ses.date,
        present: ses.totalPresent,
        total: sesTotal,
        visitors: ses.totalVisitors ?? 0,
      };
    });

    return {
      totalSessions: total,
      averageAttendance: Math.round(totalPresent / total),
      presentRate,
      lateRate,
      absentRate,
      excusedRate,
      totalVisitors,
      trend,
    };
  }, [sessions]);
}
