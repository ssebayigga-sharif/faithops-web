import type {
  GivingEntry,
  GivingFrequency,
  GivingRecord,
  MonthlySummary,
} from "../../churchTypes/giving";
import { GIVING_CATEGORIES } from "../../churchTypes/giving";

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatUGX(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSabbathDate(date: Date): string {
  // Find the next or current Saturday
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 6 ? 0 : 6 - day;
  d.setDate(d.getDate() + diff);
  return d.toLocaleDateString("en-UG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Tithe calculator ─────────────────────────────────────────────────────────

export function calculateSuggestedTithe(income: number): number {
  return Math.round(income * 0.1);
}

// ─── Receipt number ───────────────────────────────────────────────────────────

export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `KSA-${year}${month}-${rand}`;
}

// ─── Totals ───────────────────────────────────────────────────────────────────

export function getTotalFromEntries(entries: GivingEntry[]): number {
  return entries.reduce((sum, e) => sum + (e.amount || 0), 0);
}

export function getTitheFromEntries(entries: GivingEntry[]): number {
  return entries
    .filter((e) => e.categoryId === "tithe")
    .reduce((sum, e) => sum + (e.amount || 0), 0);
}

export function getOfferingsFromEntries(entries: GivingEntry[]): number {
  return entries
    .filter((e) => e.categoryId !== "tithe")
    .reduce((sum, e) => sum + (e.amount || 0), 0);
}

// ─── Category label lookup ────────────────────────────────────────────────────

export function getCategoryLabel(id: string): string {
  return GIVING_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

// ─── Frequency label ─────────────────────────────────────────────────────────

const FREQUENCY_LABELS: Record<GivingFrequency, string> = {
  once: "One-time",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

export function getFrequencyLabel(freq: GivingFrequency): string {
  return FREQUENCY_LABELS[freq];
}

// ─── Monthly summary builder ──────────────────────────────────────────────────

export function buildMonthlySummary(
  records: GivingRecord[],
  month: string,
): MonthlySummary {
  const monthRecords = records.filter((r) => r.date.startsWith(month));

  const byCategory = {} as MonthlySummary["byCategory"];
  for (const record of monthRecords) {
    for (const entry of record.entries) {
      byCategory[entry.categoryId] =
        (byCategory[entry.categoryId] ?? 0) + entry.amount;
    }
  }

  const totalTithe = monthRecords.reduce(
    (sum, r) => sum + getTitheFromEntries(r.entries),
    0,
  );
  const totalOfferings = monthRecords.reduce(
    (sum, r) => sum + getOfferingsFromEntries(r.entries),
    0,
  );

  return {
    month,
    totalTithe,
    totalOfferings,
    totalAmount: totalTithe + totalOfferings,
    recordCount: monthRecords.length,
    byCategory,
  };
}

// ─── Recent Sabbaths ──────────────────────────────────────────────────────────

export function getRecentSabbaths(count = 8): string[] {
  const sabbaths: string[] = [];
  const today = new Date();
  const day = today.getDay();
  // Walk back to last Saturday
  const lastSat = new Date(today);
  lastSat.setDate(today.getDate() - ((day + 1) % 7));
  for (let i = 0; i < count; i++) {
    const d = new Date(lastSat);
    d.setDate(lastSat.getDate() - i * 7);
    sabbaths.push(d.toISOString().split("T")[0]);
  }
  return sabbaths;
}
