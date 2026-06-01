import type { Gender, MaritalStatus, MembershipStatus, BaptismStatus } from "@/shared/types";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

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
  createdAt: string;
  updatedAt: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface UseProfileReturn {
  profile: ChurchProfile;
  isDirty: boolean;
  saveStatus: SaveStatus;
  errorMessage: string;
  isLoading: boolean;
  updateField: <K extends keyof ChurchProfile>(
    field: K,
    value: ChurchProfile[K],
  ) => void;
  updateNestedField: (
    parent: "emergencyContact",
    field: string,
    value: string,
  ) => void;
  saveProfile: () => Promise<void>;
  loadProfile: (uid: string) => Promise<void>;
  resetProfile: () => void;
  updatePhoto: (dataUrl: string) => void;
}
