import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ProfileFormValues } from "../types";
import type {
  Gender,
  MaritalStatus,
  MembershipStatus,
  BaptismStatus,
} from "../../../shared/types";

// Define the validation schema using Zod
// Type-aligned exactly to ProfileFormValues
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  gender: z.custom<Gender>(
    (val) =>
      ["male", "female", "Female", "prefer_not_to_say", ""].includes(
        val as string,
      ),
    {
      message: "Invalid gender selected",
    },
  ),
  dateOfBirth: z.string(),
  maritalStatus: z.custom<MaritalStatus>(
    (val) =>
      [
        "single",
        "married",
        "widowed",
        "divorced",
        "Single",
        "Maried",
        "",
      ].includes(val as string),
    {
      message: "Invalid marital status",
    },
  ),
  spouseName: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  department: z.string(),
  cellGroup: z.string(),
  membershipStatus: z.custom<MembershipStatus>(
    (val) =>
      ["active", "inactive", "visitor", "transferred"].includes(val as string),
    {
      message: "Invalid membership status",
    },
  ),
  baptismStatus: z.custom<BaptismStatus>(
    (val) =>
      ["baptised", "not_baptised", "pending", ""].includes(val as string),
    {
      message: "Invalid baptism status",
    },
  ),
  dateJoined: z.string(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  }),
  profilePhotoUrl: z.string(),
});

export function useProfileForm(
  defaultValues: Partial<ProfileFormValues>,
): UseFormReturn<ProfileFormValues> {
  return useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      maritalStatus: "",
      spouseName: "",
      address: "",
      city: "",
      country: "",
      department: "",
      cellGroup: "",
      membershipStatus: "visitor",
      baptismStatus: "",
      dateJoined: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      profilePhotoUrl: "",
      coverPhotoUrl: "",
      ...defaultValues,
    },
    mode: "onBlur",
  });
}
