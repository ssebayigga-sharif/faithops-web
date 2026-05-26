import axios from "axios";
import type {
  AttendanceRecord,
  AttendanceSession,
  AttendanceRow,
  Member,
  ServiceType,
} from "./attendance";

// ── Axios instance ────────────────────────────────────────────
export const firebaseAxios = axios.create({
  baseURL: "https://my-church-9abc5-default-rtdb.firebaseio.com",
  headers: { "Content-Type": "application/json" },
});

// Firebase RTDB returns null for missing nodes — normalise to []
const toArray = <T>(data: Record<string, T> | null): T[] =>
  data ? Object.values(data) : [];

// ── Session ID helper ─────────────────────────────────────────
export const buildSessionId = (
  date: string,
  serviceType: ServiceType,
): string => `${date}_${serviceType.replace(/\s+/g, "_").toLowerCase()}`;

// ── Members ───────────────────────────────────────────────────
export const fetchMembers = async (): Promise<Member[]> => {
  const { data } = await firebaseAxios.get<Record<string, Member> | null>(
    "/members.json",
  );
  return toArray(data);
};

// ── Sessions ──────────────────────────────────────────────────
export const fetchSessions = async (): Promise<AttendanceSession[]> => {
  const { data } = await firebaseAxios.get<Record<
    string,
    AttendanceSession
  > | null>("/attendance/sessions.json");
  return toArray(data).sort((a, b) => b.date.localeCompare(a.date));
};

export const fetchSession = async (
  sessionId: string,
): Promise<AttendanceSession | null> => {
  const { data } = await firebaseAxios.get<AttendanceSession | null>(
    `/attendance/sessions/${sessionId}.json`,
  );
  return data;
};

// ── Records ───────────────────────────────────────────────────
export const fetchSessionRecords = async (
  sessionId: string,
): Promise<AttendanceRecord[]> => {
  const { data } = await firebaseAxios.get<Record<
    string,
    AttendanceRecord
  > | null>(`/attendance/records/${sessionId}.json`);
  return toArray(data);
};

export const fetchMemberRecords = async (
  memberId: string,
): Promise<AttendanceRecord[]> => {
  const { data } = await firebaseAxios.get<Record<
    string,
    AttendanceRecord
  > | null>(`/attendance/memberIndex/${memberId}.json`);
  return toArray(data).sort((a, b) => b.date.localeCompare(a.date));
};

// ── Bulk save (one session worth of records) ──────────────────
export interface BulkSavePayload {
  date: string;
  serviceType: ServiceType;
  rows: AttendanceRow[];
  markedBy: string;
}

export const bulkSaveAttendance = async ({
  date,
  serviceType,
  rows,
  markedBy,
}: BulkSavePayload): Promise<AttendanceSession> => {
  const sessionId = buildSessionId(date, serviceType);
  const now = new Date().toISOString();

  // Build records map
  const recordsMap: Record<string, AttendanceRecord> = {};
  const memberIndexUpdates: Record<string, AttendanceRecord> = {};

  rows.forEach((row) => {
    const record: AttendanceRecord = {
      id: `${sessionId}_${row.memberId}`,
      memberId: row.memberId,
      memberName: row.memberName,
      date,
      serviceType,
      status: row.status,
      notes: row.notes,
      markedBy,
      createdAt: now,
    };
    recordsMap[row.memberId] = record;
    memberIndexUpdates[row.memberId] = record;
  });

  const counts = rows.reduce(
    (acc, r) => ({
      ...acc,
      [r.status]: (acc[r.status as keyof typeof acc] ?? 0) + 1,
    }),
    { present: 0, absent: 0, late: 0, excused: 0 },
  );

  const session: AttendanceSession = {
    id: sessionId,
    date,
    serviceType,
    totalPresent: counts.present,
    totalAbsent: counts.absent,
    totalLate: counts.late,
    totalExcused: counts.excused,
    createdAt: now,
  };

  // Parallel writes: session + records + member index
  await Promise.all([
    firebaseAxios.put(`/attendance/sessions/${sessionId}.json`, session),
    firebaseAxios.put(`/attendance/records/${sessionId}.json`, recordsMap),
    // Per-member index so we can query by member efficiently
    ...Object.entries(memberIndexUpdates).map(([memberId, record]) =>
      firebaseAxios.put(
        `/attendance/memberIndex/${memberId}/${sessionId}.json`,
        record,
      ),
    ),
  ]);

  return session;
};

// ── Delete session ─────────────────────────────────────────────
export const deleteSession = async (sessionId: string): Promise<void> => {
  await Promise.all([
    firebaseAxios.delete(`/attendance/sessions/${sessionId}.json`),
    firebaseAxios.delete(`/attendance/records/${sessionId}.json`),
  ]);
};
