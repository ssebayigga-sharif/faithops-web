import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMembers,
  fetchSessions,
  fetchSessionRecords,
  fetchMemberRecords,
  bulkSaveAttendance,
  deleteSession,
  type BulkSavePayload,
} from "./attendanceApi";

// ── Query keys — centralised so invalidation is type-safe ─────
export const QK = {
  members: ["members"] as const,
  sessions: ["attendance", "sessions"] as const,
  sessionRecords: (id: string) => ["attendance", "records", id] as const,
  memberRecords: (id: string) => ["attendance", "member", id] as const,
};

// ── Members ───────────────────────────────────────────────────
export function useMembers() {
  return useQuery({
    queryKey: QK.members,
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // members rarely change mid-session
  });
}

// ── Sessions list ─────────────────────────────────────────────
export function useSessions() {
  return useQuery({
    queryKey: QK.sessions,
    queryFn: fetchSessions,
  });
}

// ── Records for one session ───────────────────────────────────
export function useSessionRecords(sessionId: string | null) {
  return useQuery({
    queryKey: QK.sessionRecords(sessionId ?? ""),
    queryFn: () => fetchSessionRecords(sessionId!),
    enabled: !!sessionId,
  });
}

// ── Records for one member ────────────────────────────────────
export function useMemberRecords(memberId: string | null) {
  return useQuery({
    queryKey: QK.memberRecords(memberId ?? ""),
    queryFn: () => fetchMemberRecords(memberId!),
    enabled: !!memberId,
  });
}

// ── Bulk save mutation ────────────────────────────────────────
export function useBulkSaveAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkSavePayload) => bulkSaveAttendance(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.sessions });
    },
  });
}

// ── Delete session mutation ───────────────────────────────────
export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.sessions });
    },
  });
}
