import type {
  Gender,
  MaritalStatus,
  MembershipStatus,
  BaptismStatus,
  ChurchRole,
} from "../../shared/types";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

/**
 * Full profile stored in Firebase at /profiles/{uid}.json
 * All fields retained for backward compatibility and admin use.
 */
export interface ChurchProfile {
  uid?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  nationalId: string;
  profilePhotoUrl: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  maritalStatus: MaritalStatus;
  spouseName: string;
  numberOfChildren: number | "";
  emergencyContact: EmergencyContact;
  membershipStatus: MembershipStatus;
  membershipNumber: string;
  dateJoined: string;
  baptismStatus: BaptismStatus;
  baptismDate: string;
  department: string;
  cellGroup: string;
  serviceUnit: string;
  ministryRoles: string[];
  spiritualGifts: string[];
  occupation: string;
  employer: string;
  role: ChurchRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subset of ChurchProfile fields shown on the user-facing profile form.
 * Used with react-hook-form for validation.
 */
export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  spouseName: string;
  address: string;
  city: string;
  country: string;
  department: string;
  cellGroup: string;
  membershipStatus: MembershipStatus;
  baptismStatus: BaptismStatus;
  dateJoined: string;
  emergencyContact: EmergencyContact;
  profilePhotoUrl: string;
}
