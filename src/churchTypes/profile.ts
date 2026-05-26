export type MaritalStatus = "single" | "married" | "widowed" | "divorced" | "";
export type Gender = "male" | "female" | "prefer_not_to_say" | "";
export type MembershipStatus =
  | "active"
  | "inactive"
  | "visitor"
  | "transferred";
export type BaptismStatus = "baptised" | "not_baptised" | "pending" | "";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface ChurchProfile {
  uid?: string;

  // Personal
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  nationalId: string;
  profilePhotoUrl: string;

  // Contact
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;

  // Family
  maritalStatus: MaritalStatus;
  spouseName: string;
  numberOfChildren: number | "";
  emergencyContact: EmergencyContact;

  // Church
  membershipStatus: MembershipStatus;
  membershipNumber: string;
  dateJoined: string;
  baptismStatus: BaptismStatus;
  baptismDate: string;
  department: string;
  cellGroup: string;
  serviceUnit: string;

  // Ministry
  ministryRoles: string[];
  spiritualGifts: string[];
  occupation: string;
  employer: string;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE: ChurchProfile = {
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  nationalId: "",
  profilePhotoUrl: "",
  email: "",
  phone: "",
  alternatePhone: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  maritalStatus: "",
  spouseName: "",
  numberOfChildren: "",
  emergencyContact: { name: "", relationship: "", phone: "" },
  membershipStatus: "visitor",
  membershipNumber: "",
  dateJoined: "",
  baptismStatus: "",
  baptismDate: "",
  department: "",
  cellGroup: "",
  serviceUnit: "",
  ministryRoles: [],
  spiritualGifts: [],
  occupation: "",
  employer: "",
  createdAt: "",
  updatedAt: "",
};
