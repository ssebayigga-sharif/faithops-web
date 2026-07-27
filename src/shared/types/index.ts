import type { CarbonIconType } from "@carbon/icons-react";

export type NavigationItem = {
  path: string;
  label: string;
  description: string;
  icon: CarbonIconType;
};

export interface NavItem {
  label: string;
  path: string;
}

export type Gender = "male" | "female" | "Female" | "prefer_not_to_say" | "";

export type MaritalStatus =
  | "single"
  | "married"
  | "widowed"
  | "divorced"
  | "Single"
  | "Maried"
  | "";

export type MembershipStatus =
  | "active"
  | "inactive"
  | "visitor"
  | "transferred";

export type BaptismStatus = "baptised" | "not_baptised" | "pending" | "";

export type ChurchRole = "pastor" | "elder" | "deacon" | "treasurer" | "member";

export interface FirebaseApiError {
  message: string;
  status: number | null;
  raw: unknown;
}

/**
 * Unified service type across Attendance, Members, and Events modules.
 * This is the single source of truth for worship service categories.
 */
export type ServiceType =
  | "Sabbath Programmes"
  | "Wednesday Fellowship"
  | "Friday Prayer"
  | "Prayer and Fasting"
  | "Special Event"
  | "Divine Service"
  | "Sabbath School"
  | "AY Program"
  | "Prayer Meeting"
  | "Bible Study"
  | "Choir Practice"
  | "Board Meeting";

/**
 * Maps legacy member attendance service types to the unified type.
 */
export function mapLegacyServiceType(legacy: string): ServiceType {
  const map: Record<string, ServiceType> = {
    sunday: "Divine Service",
    Sunday: "Divine Service",
    midweek: "Wednesday Fellowship",
    Midweek: "Wednesday Fellowship",
    special: "Special Event",
    Special: "Special Event",
  };
  return map[legacy] ?? "Sabbath Programmes";
}

/**
 * Maps attendance system ServiceType to the string used in member records.
 */
export function toLegacyServiceType(type: ServiceType): string {
  switch (type) {
    case "Divine Service":
      return "Sunday";
    case "Wednesday Fellowship":
    case "Friday Prayer":
    case "Prayer Meeting":
      return "Midweek";
    default:
      return "Special";
  }
}

/**
 * Attendance status options.
 */
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
