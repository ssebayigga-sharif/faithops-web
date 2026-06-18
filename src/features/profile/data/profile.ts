import type { ChurchProfile } from "@/features/profile/types";

/**
 * Default empty profile.
 * All fields included even if not shown in the UI form,
 * because they are stored in Firebase and may be used by admin features.
 */
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
