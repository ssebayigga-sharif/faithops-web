// ─── SDA Biblical Giving Categories ─────────────────────────────────────────
// Structured according to the Seventh-day Adventist Church Manual
// and North American Division stewardship guidelines.

import type { GivingCategory, GivingFrequency, GivingMethod } from "@/features/giving/types";

export type {
  GivingCategory,
  GivingCategoryId,
  GivingEntry,
  GivingFrequency,
  GivingMethod,
  GivingRecord,
  MonthlySummary,
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
    id: "local_church_budget",
    label: "Local Church Budget",
    subtitle: "Operational ministry at Kabulengwa SDA",
    scripture:
      "Each of you should give what you have decided in your heart to give.",
    scriptureRef: "2 Corinthians 9:7",
    isTithe: false,
    required: false,
    color: "green",
  },
  {
    id: "building_fund",
    label: "Building & Renovation Fund",
    subtitle: "Maintaining and expanding our sanctuary",
    scripture: "Unless the Lord builds the house, the builders labor in vain.",
    scriptureRef: "Psalm 127:1",
    isTithe: false,
    required: false,
    color: "amber",
  },
  {
    id: "world_budget",
    label: "World Budget Offering",
    subtitle: "Supporting global Adventist mission",
    scripture:
      "Go and make disciples of all nations, baptizing them in the name of the Father.",
    scriptureRef: "Matthew 28:19",
    isTithe: false,
    required: false,
    color: "purple",
  },
  {
    id: "adra",
    label: "ADRA Uganda",
    subtitle: "Adventist Development and Relief Agency",
    scripture:
      "I was hungry and you gave me food, I was a stranger and you welcomed me.",
    scriptureRef: "Matthew 25:35",
    isTithe: false,
    required: false,
    color: "teal",
  },
  {
    id: "community_services",
    label: "Community Services",
    subtitle: "Local welfare and outreach programs",
    scripture:
      "Religion that God our Father accepts is this: to look after orphans and widows.",
    scriptureRef: "James 1:27",
    isTithe: false,
    required: false,
    color: "coral",
  },
  {
    id: "evangelism",
    label: "Evangelism & Outreach",
    subtitle: "Crusades, literature, and public ministry",
    scripture: "How beautiful are the feet of those who bring good news!",
    scriptureRef: "Romans 10:15",
    isTithe: false,
    required: false,
    color: "blue",
  },
  {
    id: "bible_school",
    label: "Sabbath School / Bible School",
    subtitle: "Christian education and discipleship",
    scripture:
      "Train up a child in the way he should go; even when he is old he will not depart from it.",
    scriptureRef: "Proverbs 22:6",
    isTithe: false,
    required: false,
    color: "green",
  },
  {
    id: "welfare",
    label: "Poor & Welfare Fund",
    subtitle: "Systematic benevolence for members in need",
    scripture:
      "Whoever is kind to the poor lends to the Lord, and he will reward them.",
    scriptureRef: "Proverbs 19:17",
    isTithe: false,
    required: false,
    color: "amber",
  },
  {
    id: "special",
    label: "Special / Designated Offering",
    subtitle: "Directed giving for a specific purpose",
    scripture:
      "Honor the Lord with your wealth, with the firstfruits of all your crops.",
    scriptureRef: "Proverbs 3:9",
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

