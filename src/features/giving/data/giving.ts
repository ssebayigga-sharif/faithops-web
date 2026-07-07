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
    group: "trust_fund",
  },
  {
    id: "camp_meeting_offering",
    label: "Camp Meeting Offering",
    subtitle: "Support for camp meeting programs and logistics",
    scripture:
      "Each of you should give what you have decided in your heart to give.",
    scriptureRef: "2 Corinthians 9:7",
    isTithe: false,
    required: false,
    color: "green",
    group: "trust_fund",
  },
  {
    id: "13th_sabbath",
    label: "13th Sabbath",
    subtitle: "13th Sabbath missions overflow offering",
    scripture:
      "Honor the Lord with your wealth, with the firstfruits of all your crops.",
    scriptureRef: "Proverbs 3:9",
    isTithe: false,
    required: false,
    color: "amber",
    group: "trust_fund",
  },
  {
    id: "prime_radio",
    label: "Prime Radio",
    subtitle: "Support for radio ministry and outreach",
    scripture:
      "Go and make disciples of all nations, baptizing them in the name of the Father.",
    scriptureRef: "Matthew 28:19",
    isTithe: false,
    required: false,
    color: "purple",
    group: "trust_fund",
  },
  {
    id: "kireka_adventist_hospital",
    label: "Kireka Adventist Hospital",
    subtitle: "Medical missions and healthcare support",
    scripture: "Heal the sick, raise the dead, cleanse those who have leprosy.",
    scriptureRef: "Matthew 10:8",
    isTithe: false,
    required: false,
    color: "teal",
    group: "trust_fund",
  },
  {
    id: "sabbath_school",
    label: "Sabbath School",
    subtitle: "Sabbath School lessons and programs",
    scripture: "Search the Scriptures daily whether those things were so.",
    scriptureRef: "Acts 17:11",
    isTithe: false,
    required: false,
    color: "coral",
    group: "combined_offerings",
  },
  {
    id: "thanksgiving",
    label: "Thanks Giving",
    subtitle: "Thanksgiving offering for God's blessings",
    scripture: "Enter his gates with thanksgiving and his courts with praise.",
    scriptureRef: "Psalm 100:4",
    isTithe: false,
    required: false,
    color: "green",
    group: "combined_offerings",
  },
  {
    id: "divine",
    label: "Devine",
    subtitle: "Divine service and worship support",
    scripture:
      "Let us come before him with thanksgiving and extol him with music and song.",
    scriptureRef: "Psalm 95:2",
    isTithe: false,
    required: false,
    color: "blue",
    group: "combined_offerings",
  },
  {
    id: "local_church_building",
    label: "Local Church Building",
    subtitle: "Local church building maintenance and expansion",
    scripture: "Unless the Lord builds the house, the builders labor in vain.",
    scriptureRef: "Psalm 127:1",
    isTithe: false,
    required: false,
    color: "amber",
    group: "other_offerings",
  },
  {
    id: "district_project_fund",
    label: "District Project Fund",
    subtitle: "District-wide projects and initiatives",
    scripture:
      "Each of you should use whatever gift you have received to serve others.",
    scriptureRef: "1 Peter 4:10",
    isTithe: false,
    required: false,
    color: "purple",
    group: "other_offerings",
  },
  {
    id: "lunch",
    label: "Lunch",
    subtitle: "Church lunch and fellowship meals",
    scripture: "Do not forget to show hospitality to strangers.",
    scriptureRef: "Hebrews 13:2",
    isTithe: false,
    required: false,
    color: "teal",
    group: "other_offerings",
  },
  {
    id: "social_and_welfare",
    label: "Social and Welfare",
    subtitle: "Social services and welfare support",
    scripture:
      "Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows.",
    scriptureRef: "James 1:27",
    isTithe: false,
    required: false,
    color: "coral",
    group: "other_offerings",
  },
  {
    id: "camp_meeting_expense",
    label: "Camp Meeting Exp",
    subtitle: "Camp meeting expenses and logistics",
    scripture:
      "Prepare the way for the people. Build the road, remove the stones from the path.",
    scriptureRef: "Isaiah 62:10",
    isTithe: false,
    required: false,
    color: "green",
    group: "other_offerings",
  },
  {
    id: "evangelism",
    label: "Evangelism",
    subtitle: "Local and global evangelism efforts",
    scripture:
      "Go and make disciples of all nations, baptizing them in the name of the Father.",
    scriptureRef: "Matthew 28:19",
    isTithe: false,
    required: false,
    color: "blue",
    group: "other_offerings",
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
