import type { GivingRecord } from "@/features/giving/types";

const STORAGE_KEY = "faithops_giving_records";

// ─── LocalStorage persistence ─────────────────────────────────────────────────

export function loadRecords(): GivingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GivingRecord[];
  } catch {
    console.warn("Failed to load giving records from localStorage");
    return [];
  }
}

export function saveRecord(record: GivingRecord): void {
  try {
    const records = loadRecords();
    records.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save giving record:", err);
  }
}

export function deleteRecord(id: string): void {
  try {
    const records = loadRecords();
    const filtered = records.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete giving record:", err);
  }
}

export function updateRecord(updated: GivingRecord): void {
  try {
    const records = loadRecords();
    const index = records.findIndex((r) => r.id === updated.id);
    if (index !== -1) {
      records[index] = updated;
    } else {
      records.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to update giving record:", err);
  }
}

export function clearAllRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear giving records:", err);
  }
}

// ─── Search / filter helpers ──────────────────────────────────────────────────

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
      r.recordedBy.toLowerCase().includes(lower) ||
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
