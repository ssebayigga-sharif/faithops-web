import { firebaseClient } from "@/shared/services/firebase.client";
import type { GivingRecord } from "@/features/giving/types";

const STORAGE_KEY = "faithops_giving_records";
const GIVING_RECORDS_PATH = "/giving-records";

type FirebaseGivingMap = Record<string, GivingRecord>;

function readLocalRecords(): GivingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GivingRecord[];
  } catch {
    console.warn("Failed to load giving records from localStorage");
    return [];
  }
}

function writeLocalRecords(records: GivingRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to persist giving records locally:", err);
  }
}

function mapFirebaseRecords(data: FirebaseGivingMap | null): GivingRecord[] {
  if (!data) return [];

  return Object.entries(data)
    .map(([firebaseKey, value]) => ({
      ...value,
      id: value.id || firebaseKey,
      _firebaseKey: firebaseKey,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function loadRecords(): Promise<GivingRecord[]> {
  try {
    const res = await firebaseClient.get<FirebaseGivingMap | null>(
      `${GIVING_RECORDS_PATH}.json`,
    );
    const records = mapFirebaseRecords(res.data);
    if (records.length > 0) {
      writeLocalRecords(records);
    }
    return records;
  } catch (err) {
    console.warn("Falling back to local storage for giving records:", err);
    return readLocalRecords();
  }
}

export async function saveRecord(record: GivingRecord): Promise<GivingRecord> {
  try {
    const payload = { ...record };
    delete payload._firebaseKey;

    const res = await firebaseClient.post(
      `${GIVING_RECORDS_PATH}.json`,
      payload,
    );
    const savedRecord: GivingRecord = {
      ...record,
      id: record.id || res.data?.name || `${Date.now()}`,
      _firebaseKey: res.data?.name,
    };

    const localRecords = readLocalRecords();
    writeLocalRecords([
      savedRecord,
      ...localRecords.filter((r) => r.id !== savedRecord.id),
    ]);
    return savedRecord;
  } catch (err) {
    console.error("Failed to save giving record to Firebase:", err);
    const localRecords = readLocalRecords();
    const fallbackRecord = { ...record };
    writeLocalRecords([
      fallbackRecord,
      ...localRecords.filter((r) => r.id !== fallbackRecord.id),
    ]);
    return fallbackRecord;
  }
}

export async function deleteRecord(id: string): Promise<void> {
  try {
    const records = await loadRecords();
    const target = records.find((record) => record.id === id);
    if (!target?._firebaseKey) {
      writeLocalRecords(records.filter((record) => record.id !== id));
      return;
    }

    await firebaseClient.delete(
      `${GIVING_RECORDS_PATH}/${target._firebaseKey}.json`,
    );
    writeLocalRecords(records.filter((record) => record.id !== id));
  } catch (err) {
    console.error("Failed to delete giving record:", err);
  }
}

export async function updateRecord(updated: GivingRecord): Promise<void> {
  try {
    const records = await loadRecords();
    const target = records.find((record) => record.id === updated.id);
    const firebaseKey = target?._firebaseKey ?? updated._firebaseKey;

    if (firebaseKey) {
      const payload = { ...updated };
      delete payload._firebaseKey;
      await firebaseClient.put(
        `${GIVING_RECORDS_PATH}/${firebaseKey}.json`,
        payload,
      );
    } else {
      await saveRecord(updated);
    }

    const nextRecords = records.filter((record) => record.id !== updated.id);
    writeLocalRecords([updated, ...nextRecords]);
  } catch (err) {
    console.error("Failed to update giving record:", err);
  }
}

export async function clearAllRecords(): Promise<void> {
  try {
    await firebaseClient.delete(`${GIVING_RECORDS_PATH}.json`);
    writeLocalRecords([]);
  } catch (err) {
    console.error("Failed to clear giving records:", err);
  }
}

export function searchRecords(
  records: GivingRecord[],
  query: string,
): GivingRecord[] {
  if (!query.trim()) return records;
  const lower = query.toLowerCase();
  return records.filter(
    (r) =>
      r.memberName.toLowerCase().includes(lower) ||
      r.receiptNumber.toLowerCase().includes(lower) ||
      r.recordedBy?.toLowerCase().includes(lower) ||
      r.notes?.toLowerCase().includes(lower),
  );
}

export function filterRecordsByDateRange(
  records: GivingRecord[],
  fromDate: string,
  toDate: string,
): GivingRecord[] {
  return records.filter((r) => r.date >= fromDate && r.date <= toDate);
}

export function filterRecordsByCategory(
  records: GivingRecord[],
  categoryId: string,
): GivingRecord[] {
  if (!categoryId) return records;
  return records.filter((r) =>
    r.entries.some((e) => e.categoryId === categoryId),
  );
}

export function filterRecordsByMember(
  records: GivingRecord[],
  memberName: string,
): GivingRecord[] {
  if (!memberName.trim()) return records;
  return records.filter((r) =>
    r.memberName.toLowerCase().includes(memberName.toLowerCase()),
  );
}
