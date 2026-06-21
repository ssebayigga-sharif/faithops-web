// ─── Core Giving Categories ────────────────────────────────────────────────
// Simplified to 4 types: Tithe, Offering, Building Fund, Mission Fund

import type {
  GivingCategory,
  GivingFrequency,
  GivingMethod,
} from "@/features/giving/types";

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
} from "@/features/giving/types";

export const GIVING_CATEGORIES: GivingCategory[] = [
  {
    id: "tithe",
    label: "Tithe",
    subtitle: "10% of all increase — returned to God",
    scripture:
      "Bring the whole tithe into the storehouse, that there may be food in my house.",
    scriptureRef: "Malachi 3:10",
    isTithe: true,
    required: false,
    color: "blue",
  },
  {
    id: "offering",
    label: "Offering",
    subtitle: "Freewill offering for church operations",
    scripture:
      "Each of you should give what you have decided in your heart to give.",
    scriptureRef: "2 Corinthians 9:7",
    isTithe: false,
    required: false,
    color: "green",
  },
  {
    id: "building_fund",
    label: "Building Fund",
    subtitle: "Maintaining and expanding our sanctuary",
    scripture: "Unless the Lord builds the house, the builders labor in vain.",
    scriptureRef: "Psalm 127:1",
    isTithe: false,
    required: false,
    color: "amber",
  },
  {
    id: "mission_fund",
    label: "Mission Fund",
    subtitle: "Supporting local and global evangelism",
    scripture:
      "Go and make disciples of all nations, baptizing them in the name of the Father.",
    scriptureRef: "Matthew 28:19",
    isTithe: false,
    required: false,
    color: "purple",
  },
];

export const GIVING_FREQUENCIES: { value: GivingFrequency; label: string }[] = [
  { value: "once", label: "One-time" },
  { value: "weekly", label: "Weekly (Sabbath)" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

export const GIVING_METHODS: {
  value: GivingMethod;
  label: string;
  icon: string;
}[] = [
  { value: "cash", label: "Cash / Envelope", icon: "ti-cash" },
  {
    value: "mobile_money",
    label: "Mobile Money (MTN/Airtel)",
    icon: "ti-device-mobile",
  },
  { value: "bank_transfer", label: "Bank Transfer", icon: "ti-building-bank" },
  { value: "cheque", label: "Cheque", icon: "ti-writing" },
];
