// ─── Giving module public API ─────────────────────────────────────────────────

export { default as GivingPage } from "./pages/GivingPage";
export { GivingForm } from "./components/GivingForm";
export { GivingReview } from "./components/GivingReview";
export { GivingReceipt } from "./components/GivingReceipt";
export { GivingHistory } from "./components/GivingHistory";
export { GivingSummary } from "./components/GivingSummary";
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
} from "@/features/giving/types";

// Constants
export {
  GIVING_CATEGORIES,
  GIVING_FREQUENCIES,
  GIVING_METHODS,
} from "@/features/giving/data/giving";

// Utils
export {
  buildMonthlySummary,
  calculateSuggestedTithe,
  formatSabbathDate,
  formatShortDate,
  formatUGX,
  generateReceiptNumber,
  getCategoryLabel,
  getFrequencyLabel,
  getOfferingsFromEntries,
  getRecentSabbaths,
  getTitheFromEntries,
  getTotalFromEntries,
} from "./givingUtils";
