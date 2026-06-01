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

export interface FirebaseApiError {
  message: string;
  status: number | null;
  raw: unknown;
}
