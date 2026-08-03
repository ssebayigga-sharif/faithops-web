/**
 * attendance.services.ts
 *
 * Firebase Realtime Database service for attendance tracking.
 * Follows the same pattern as MemberService and ProfileService.
 *
 * Firebase RTDB paths:
 *   /attendance/sessions/{sessionId}.json       → AttendanceSession
 *   /attendance/records/{sessionId}.json         → { memberId: AttendanceRecord }
 *   /attendance/memberIndex/{memberId}.json      → { sessionId: AttendanceRecord }
 *   /attendance/visitors/{sessionId}.json        → { visitorId: VisitorRecord }
 */

import { firebaseClient } from "../../../shared/services/firebase.client";
import type {
  AttendanceRecord,
  AttendanceSession,
  AttendanceRow,
  ServiceType,
  BulkSavePayload,
  VisitorRecord,
  VisitorRowPayload,
} from "../types";

const SESSIONS_PATH = "/attendance/sessions";
const RECORDS_PATH = "/attendance/records";
const MEMBER_INDEX_PATH = "/attendance/memberIndex";
const VISITORS_PATH = "/attendance/visitors";

type FirebaseMap<T> = Record<string, T>;

const toArray = <T>(data: FirebaseMap<T> | null): T[] =>
  data ? Object.values(data) : [];

/**
 * Builds a deterministic session ID from date + service type.
 * Example: "2026-06-19_sabbath_programmes"
 */
export const buildSessionId = (
  date: string,
  serviceType: ServiceType,
): string => `${date}_${serviceType.replace(/\s+/g, "_").toLowerCase()}`;

export const AttendanceService = {

  /** GET /attendance/sessions.json — all sessions, newest first */
  async getSessions(): Promise<AttendanceSession[]> {
    const { data } =
      await firebaseClient.get<FirebaseMap<AttendanceSession> | null>(
        `${SESSIONS_PATH}.json`,
      );
    return toArray(data).sort((a, b) => b.date.localeCompare(a.date));
  },

  /** GET /attendance/sessions/{sessionId}.json */
  async getSession(sessionId: string): Promise<AttendanceSession | null> {
    const { data } = await firebaseClient.get<AttendanceSession | null>(
      `${SESSIONS_PATH}/${sessionId}.json`,
    );
    return data ?? null;
  },

  /** GET /attendance/records/{sessionId}.json */
  async getSessionRecords(sessionId: string): Promise<AttendanceRecord[]> {
    const { data } =
      await firebaseClient.get<FirebaseMap<AttendanceRecord> | null>(
        `${RECORDS_PATH}/${sessionId}.json`,
      );
    return toArray(data);
  },

  /** GET /attendance/memberIndex/{memberId}.json */
  async getMemberRecords(memberId: string): Promise<AttendanceRecord[]> {
    const { data } =
      await firebaseClient.get<FirebaseMap<AttendanceRecord> | null>(
        `${MEMBER_INDEX_PATH}/${memberId}.json`,
      );
    return toArray(data).sort((a, b) => b.date.localeCompare(a.date));
  },

  /** GET /attendance/visitors.json — all visitors across all sessions */
  async getAllVisitors(): Promise<VisitorRecord[]> {
    const { data } = await firebaseClient.get<FirebaseMap<
      FirebaseMap<VisitorRecord>
    > | null>(`${VISITORS_PATH}.json`);
    if (!data) return [];
    const all: VisitorRecord[] = [];
    for (const sessionVisitors of Object.values(data)) {
      all.push(...Object.values(sessionVisitors));
    }
    return all.sort((a, b) => b.date.localeCompare(a.date));
  },

  /** GET /attendance/visitors/{sessionId}.json */
  async getSessionVisitors(sessionId: string): Promise<VisitorRecord[]> {
    const { data } =
      await firebaseClient.get<FirebaseMap<VisitorRecord> | null>(
        `${VISITORS_PATH}/${sessionId}.json`,
      );
    return toArray(data);
  },

  /**
   * Saves an entire attendance session atomically:
   *   1. Session summary  → /attendance/sessions/{sessionId}
   *   2. Per-member rows  → /attendance/records/{sessionId}/{memberId}
   *   3. Member index     → /attendance/memberIndex/{memberId}/{sessionId}
   *   4. Visitors         → /attendance/visitors/{sessionId}/{visitorId}
   */
  async bulkSave(payload: BulkSavePayload): Promise<AttendanceSession> {
    const { date, serviceType, rows, visitors, markedBy } = payload;
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

    // Build visitors map
    const visitorsMap: Record<string, VisitorRecord> = {};
    visitors.forEach((v, idx) => {
      const visitorId = `v_${sessionId}_${idx}`;
      const visitor: VisitorRecord = {
        id: visitorId,
        name: v.name,
        phone: v.phone,
        email: v.email,
        date,
        serviceType,
        visitedBy: markedBy,
        notes: v.notes,
        followUpStatus: "pending",
        createdAt: now,
      };
      visitorsMap[visitorId] = visitor;
    });

    // Compute session summary
    const counts = rows.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0, excused: 0 } as Record<string, number>,
    );

    const session: AttendanceSession = {
      id: sessionId,
      date,
      serviceType,
      totalPresent: counts.present,
      totalAbsent: counts.absent,
      totalLate: counts.late,
      totalExcused: counts.excused,
      totalVisitors: visitors.length,
      createdAt: now,
    };

    // Parallel writes: session + records + member index + visitors
    await Promise.all([
      firebaseClient.put(`${SESSIONS_PATH}/${sessionId}.json`, session),
      firebaseClient.put(`${RECORDS_PATH}/${sessionId}.json`, recordsMap),
      ...Object.entries(memberIndexUpdates).map(([memberId, record]) =>
        firebaseClient.put(
          `${MEMBER_INDEX_PATH}/${memberId}/${sessionId}.json`,
          record,
        ),
      ),
      ...(visitors.length > 0
        ? [
            firebaseClient.put(
              `${VISITORS_PATH}/${sessionId}.json`,
              visitorsMap,
            ),
          ]
        : []),
    ]);

    return session;
  },

  /** PATCH /attendance/visitors/{sessionId}/{visitorId}.json */
  async updateVisitorFollowUp(
    sessionId: string,
    visitorId: string,
    status: VisitorRecord["followUpStatus"],
  ): Promise<void> {
    await firebaseClient.patch(
      `${VISITORS_PATH}/${sessionId}/${visitorId}.json`,
      { followUpStatus: status },
    );
  },

  /** DELETE /attendance/sessions/{sessionId}.json + records + visitors */
  async deleteSession(sessionId: string): Promise<void> {
    await Promise.all([
      firebaseClient.delete(`${SESSIONS_PATH}/${sessionId}.json`),
      firebaseClient.delete(`${RECORDS_PATH}/${sessionId}.json`),
      firebaseClient.delete(`${VISITORS_PATH}/${sessionId}.json`),
    ]);
  },
} as const;
