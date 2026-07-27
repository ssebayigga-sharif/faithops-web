import type {
  GivingEntry,
  GivingFrequency,
  GivingRecord,
  MonthlySummary,
  YearlySummary,
  CategoryTotal,
  GivingReport,
  GivingCategoryId,
} from "@/features/giving/types";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";

//  Formatting

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

export function formatMonthLabel(month: string): string {
  const [year, num] = month.split("-");
  const date = new Date(parseInt(year), parseInt(num) - 1, 1);
  return date.toLocaleDateString("en-UG", { month: "long", year: "numeric" });
}

//  Tithe calculator

export function calculateSuggestedTithe(income: number): number {
  return Math.round(income * 0.1);
}

//  Receipt number

export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `KSA-${year}${month}-${rand}`;
}

//  Totals

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

export function getCategoryTotalFromEntries(
  entries: GivingEntry[],
  categoryId: GivingCategoryId,
): number {
  return entries
    .filter((e) => e.categoryId === categoryId)
    .reduce((sum, e) => sum + (e.amount || 0), 0);
}

export function getCategoryLabel(id: string): string {
  return GIVING_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

const FREQUENCY_LABELS: Record<GivingFrequency, string> = {
  once: "One-time",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

export function getFrequencyLabel(freq: GivingFrequency): string {
  return FREQUENCY_LABELS[freq];
}

export function buildMonthlySummary(
  records: GivingRecord[],
  month: string,
): MonthlySummary {
  const monthRecords = records.filter((r) => r.date.startsWith(month));

  const byCategory = {} as MonthlySummary["byCategory"];
  // Initialize with zeros for all categories
  for (const cat of GIVING_CATEGORIES) {
    byCategory[cat.id] = 0;
  }
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

export function buildYearlySummary(
  records: GivingRecord[],
  year: string,
): YearlySummary {
  const yearRecords = records.filter((r) => r.date.startsWith(year));

  // Build monthly breakdown
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const monthlyBreakdown = months.map((m) =>
    buildMonthlySummary(yearRecords, `${year}-${m}`),
  );

  // Aggregate by category
  const byCategory = {} as Record<GivingCategoryId, number>;
  for (const cat of GIVING_CATEGORIES) {
    byCategory[cat.id] = 0;
  }
  for (const record of yearRecords) {
    for (const entry of record.entries) {
      byCategory[entry.categoryId] =
        (byCategory[entry.categoryId] ?? 0) + entry.amount;
    }
  }

  const totalTithe = yearRecords.reduce(
    (sum, r) => sum + getTitheFromEntries(r.entries),
    0,
  );
  const totalOfferings = yearRecords.reduce(
    (sum, r) => sum + getOfferingsFromEntries(r.entries),
    0,
  );

  return {
    year,
    totalAmount: totalTithe + totalOfferings,
    totalTithe,
    totalOfferings,
    recordCount: yearRecords.length,
    monthlyBreakdown,
    byCategory,
  };
}

export function buildCategoryTotals(records: GivingRecord[]): CategoryTotal[] {
  const totals: Record<GivingCategoryId, number> = {} as Record<
    GivingCategoryId,
    number
  >;

  for (const cat of GIVING_CATEGORIES) {
    totals[cat.id] = 0;
  }

  for (const record of records) {
    for (const entry of record.entries) {
      totals[entry.categoryId] = (totals[entry.categoryId] ?? 0) + entry.amount;
    }
  }

  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0) || 1;

  return GIVING_CATEGORIES.map((cat) => ({
    categoryId: cat.id,
    label: cat.label,
    amount: totals[cat.id] ?? 0,
    percentage: Math.round(((totals[cat.id] ?? 0) / grandTotal) * 100),
  }));
}

export function buildReport(
  records: GivingRecord[],
  fromDate: string,
  toDate: string,
): GivingReport {
  const filtered = records.filter((r) => {
    return r.date >= fromDate && r.date <= toDate;
  });

  const totalTithe = filtered.reduce(
    (sum, r) => sum + getTitheFromEntries(r.entries),
    0,
  );
  const totalOfferings = filtered.reduce(
    (sum, r) => sum + getOfferingsFromEntries(r.entries),
    0,
  );

  return {
    fromDate,
    toDate,
    totalRecords: filtered.length,
    totalAmount: totalTithe + totalOfferings,
    totalTithe,
    totalOfferings,
    categoryTotals: buildCategoryTotals(filtered),
    records: filtered,
    generatedAt: new Date().toISOString(),
  };
}

export function getAvailableYears(records: GivingRecord[]): string[] {
  const years = new Set<string>();
  for (const r of records) {
    const year = r.date.slice(0, 4);
    if (year) years.add(year);
  }
  return Array.from(years).sort().reverse();
}

export function getAvailableMonths(records: GivingRecord[]): string[] {
  const months = new Set<string>();
  for (const r of records) {
    const month = r.date.slice(0, 7);
    if (month) months.add(month);
  }
  return Array.from(months).sort().reverse();
}

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
