export { default as GivingPage } from "./pages/GivingPage";
export { GivingForm } from "./components/GivingForm";
export { GivingReview } from "./components/GivingReview";
export { GivingReceipt } from "./components/GivingReceipt";
export { GivingHistory } from "./components/GivingHistory";
export { GivingSummary } from "./components/GivingSummary";
export { SummaryCards } from "./components/SummaryCards";
export { GivingReports } from "./components/GivingReports";
export { MemberStatement } from "./components/MemberStatement";
export { useGiving } from "./useGiving";

// Types
export type {
  GivingCategory,
  GivingCategoryId,
  GivingEntry,
  GivingFrequency,
  GivingMethod,
  GivingRecord,
  MonthlySummary,
  YearlySummary,
  GivingReport,
  CategoryTotal,
} from "@/features/giving/types";

export {
  GIVING_CATEGORIES,
  GIVING_FREQUENCIES,
  GIVING_METHODS,
} from "@/features/giving/data/giving";

// Utils
export {
  buildMonthlySummary,
  buildYearlySummary,
  buildReport,
  buildCategoryTotals,
  calculateSuggestedTithe,
  formatSabbathDate,
  formatShortDate,
  formatMonthLabel,
  formatUGX,
  generateReceiptNumber,
  getCategoryLabel,
  getFrequencyLabel,
  getOfferingsFromEntries,
  getTitheFromEntries,
  getCategoryTotalFromEntries,
  getTotalFromEntries,
  getRecentSabbaths,
  getAvailableYears,
  getAvailableMonths,
} from "./givingUtils";

// Services
export {
  loadRecords,
  saveRecord,
  deleteRecord,
  updateRecord,
  clearAllRecords,
  searchRecords,
  filterRecordsByDateRange,
  filterRecordsByCategory,
  filterRecordsByMember,
} from "./services/giving.service";
