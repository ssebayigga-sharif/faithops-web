export type ChurchRole = "pastor" | "elder" | "deacon" | "treasurer" | "member";

export interface AuthUserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: ChurchRole;
  profilePhotoUrl: string;
  createdAt: string;
  updatedAt: string;
}
