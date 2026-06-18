import React from "react";
import {
  TextInput,
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
  Tile,
} from "@carbon/react";
import { User } from "@carbon/icons-react";
import { Controller } from "react-hook-form";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProfileFormValues } from "../types";

interface Props {
  readOnly: boolean;
  profile: Partial<ProfileFormValues>;
  register?: UseFormRegister<ProfileFormValues>;
  errors?: FieldErrors<ProfileFormValues>;
  control?: Control<ProfileFormValues>;
}

export const PersonalInfoSection: React.FC<Props> = ({
  readOnly,
  profile,
  register,
  errors,
  control,
}) => {
  const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const formatGender = (g?: string) => {
    if (!g) return "—";
    if (g === "prefer_not_to_say") return "Prefer not to say";
    return g.charAt(0).toUpperCase() + g.slice(1);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (readOnly) {
    return (
      <Tile className="profile-section">
        <h2 className="profile-section__heading">
          <User size={20} aria-hidden /> Personal Information
        </h2>
        <div className="profile-view-grid">
          <div className="profile-view-item">
            <span className="profile-view-label">First Name</span>
            <span className="profile-view-value">{profile.firstName || "—"}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Last Name</span>
            <span className="profile-view-value">{profile.lastName || "—"}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Gender</span>
            <span className="profile-view-value">{formatGender(profile.gender)}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Date of Birth</span>
            <span className="profile-view-value">{formatDate(profile.dateOfBirth)}</span>
          </div>
        </div>
      </Tile>
    );
  }

  // Edit Mode
  if (!register || !errors || !control) return null;

  return (
    <Tile className="profile-section">
      <h2 className="profile-section__heading">
        <User size={20} aria-hidden /> Personal Information
      </h2>

      <div className="profile-field-grid">
        <TextInput
          id="p-firstName"
          labelText="First Name *"
          placeholder="Enter first name"
          invalid={!!errors.firstName}
          invalidText={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextInput
          id="p-lastName"
          labelText="Last Name *"
          placeholder="Enter last name"
          invalid={!!errors.lastName}
          invalidText={errors.lastName?.message}
          {...register("lastName")}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              id="p-gender"
              labelText="Gender"
              invalid={!!errors.gender}
              invalidText={errors.gender?.message}
              {...field}
            >
              <SelectItem value="" text="Select gender" />
              <SelectItem value="male" text="Male" />
              <SelectItem value="female" text="Female" />
              <SelectItem value="prefer_not_to_say" text="Prefer not to say" />
            </Select>
          )}
        />

        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              datePickerType="single"
              value={value}
              onChange={([d]) => d && onChange(toIso(d))}
              maxDate={new Date().toLocaleDateString("en-US")}
            >
              <DatePickerInput
                id="p-dob"
                labelText="Date of Birth"
                placeholder="mm/dd/yyyy"
                invalid={!!errors.dateOfBirth}
                invalidText={errors.dateOfBirth?.message}
              />
            </DatePicker>
          )}
        />
      </div>
    </Tile>
  );
};
