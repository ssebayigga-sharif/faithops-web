// ─── Giving module public API ─────────────────────────────────────────────────

export { default as GivingPage } from "./GivingPage";
export { GivingForm } from "./GivingForm";
export { GivingReview } from "./GivingReview";
export { GivingReceipt } from "./GivingReceipt";
export { GivingHistory } from "./GivingHistory";
export { GivingSummary } from "./GivingSummary";
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
} from "../../churchTypes/giving";

// Constants
export {
  GIVING_CATEGORIES,
  GIVING_FREQUENCIES,
  GIVING_METHODS,
} from "../../churchTypes/giving";

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
