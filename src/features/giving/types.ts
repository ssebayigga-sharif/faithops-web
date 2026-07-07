export type GivingCategoryId =
  | "tithe"
  | "camp_meeting_offering"
  | "13th_sabbath"
  | "prime_radio"
  | "kireka_adventist_hospital"
  | "sabbath_school"
  | "thanksgiving"
  | "divine"
  | "local_church_building"
  | "district_project_fund"
  | "lunch"
  | "social_and_welfare"
  | "camp_meeting_expense"
  | "evangelism";

export type GivingFrequency = "once" | "weekly" | "monthly" | "quarterly";

export type GivingMethod = "cash" | "mobile_money" | "bank_transfer" | "cheque";

export interface GivingCategory {
  id: GivingCategoryId;
  label: string;
  subtitle: string;
  scripture: string;
  scriptureRef: string;
  isTithe: boolean;
  required: boolean;
  color: "blue" | "green" | "amber" | "purple" | "teal" | "coral";
  group: "trust_fund" | "combined_offerings" | "other_offerings";
}

export interface GivingEntry {
  categoryId: GivingCategoryId;
  amount: number;
  note?: string;
}

export interface GivingRecord {
  _firebaseKey?: string;
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  sabbathDate: string;
  entries: GivingEntry[];
  totalAmount: number;
  method?: GivingMethod;
  frequency?: GivingFrequency;
  receiptNumber: string;
  recordedBy?: string;
  notes?: string;
  verified: boolean;
}

export interface MonthlySummary {
  month: string;
  totalTithe: number;
  totalOfferings: number;
  totalAmount: number;
  recordCount: number;
  byCategory: Record<GivingCategoryId, number>;
}

export interface YearlySummary {
  year: string;
  totalAmount: number;
  totalTithe: number;
  totalOfferings: number;
  recordCount: number;
  monthlyBreakdown: MonthlySummary[];
  byCategory: Record<GivingCategoryId, number>;
}

export interface CategoryTotal {
  categoryId: GivingCategoryId;
  label: string;
  amount: number;
  percentage: number;
}

export interface GivingReport {
  fromDate: string;
  toDate: string;
  totalRecords: number;
  totalAmount: number;
  totalTithe: number;
  totalOfferings: number;
  categoryTotals: CategoryTotal[];
  records: GivingRecord[];
  generatedAt: string;
}

export interface GivingFormState {
  memberId: string;
  memberName: string;
  sabbathDate: string;
  method?: GivingMethod;
  frequency?: GivingFrequency;
  entries: Partial<Record<GivingCategoryId, string>>;
  notes: string;
  recordedBy?: string;
  income?: string;
}

export type GivingStep = "entry" | "review" | "receipt";
