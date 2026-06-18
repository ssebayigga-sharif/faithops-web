import React from "react";
import { TextInput, Select, SelectItem, Tile } from "@carbon/react";
import { Events } from "@carbon/icons-react";
import { Controller } from "react-hook-form";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProfileFormValues } from "../types";

interface Props {
  readOnly: boolean;
  profile: Partial<ProfileFormValues>;
  register?: UseFormRegister<ProfileFormValues>;
  errors?: FieldErrors<ProfileFormValues>;
  control?: Control<ProfileFormValues>;
  maritalStatusValue?: string;
}

export const FamilySection: React.FC<Props> = ({
  readOnly,
  profile,
  register,
  errors,
  control,
  maritalStatusValue,
}) => {
  const formatMaritalStatus = (status?: string) => {
    if (!status) return "—";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isMarried = (maritalStatusValue || profile.maritalStatus)?.toLowerCase() === "married";

  if (readOnly) {
    return (
      <Tile className="profile-section">
        <h2 className="profile-section__heading">
          <Events size={20} aria-hidden /> Family &amp; Emergency Contact
        </h2>
        <div className="profile-view-grid">
          <div className="profile-view-item">
            <span className="profile-view-label">Marital Status</span>
            <span className="profile-view-value">{formatMaritalStatus(profile.maritalStatus)}</span>
          </div>
          {isMarried && (
            <div className="profile-view-item">
              <span className="profile-view-label">Spouse Name</span>
              <span className="profile-view-value">{profile.spouseName || "—"}</span>
            </div>
          )}
        </div>

        <h3 className="profile-subsection-heading">Emergency Contact</h3>
        <div className="profile-view-grid">
          <div className="profile-view-item">
            <span className="profile-view-label">Contact Name</span>
            <span className="profile-view-value">{profile.emergencyContact?.name || "—"}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Relationship</span>
            <span className="profile-view-value">{profile.emergencyContact?.relationship || "—"}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Phone Number</span>
            <span className="profile-view-value">{profile.emergencyContact?.phone || "—"}</span>
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
        <Events size={20} aria-hidden /> Family &amp; Emergency Contact
      </h2>

      <div className="profile-field-grid">
        <Controller
          name="maritalStatus"
          control={control}
          render={({ field }) => (
            <Select
              id="f-marital"
              labelText="Marital Status"
              invalid={!!errors.maritalStatus}
              invalidText={errors.maritalStatus?.message}
              {...field}
            >
              <SelectItem value="" text="Select status" />
              <SelectItem value="single" text="Single" />
              <SelectItem value="married" text="Married" />
              <SelectItem value="widowed" text="Widowed" />
              <SelectItem value="divorced" text="Divorced" />
            </Select>
          )}
        />

        {isMarried && (
          <TextInput
            id="f-spouse"
            labelText="Spouse's Full Name"
            placeholder="Enter spouse's name"
            invalid={!!errors.spouseName}
            invalidText={errors.spouseName?.message}
            {...register("spouseName")}
          />
        )}
      </div>

      <h3 className="profile-subsection-heading">Emergency Contact</h3>

      <div className="profile-field-grid">
        <TextInput
          id="ec-name"
          labelText="Full Name"
          placeholder="Contact's full name"
          invalid={!!errors.emergencyContact?.name}
          invalidText={errors.emergencyContact?.name?.message}
          {...register("emergencyContact.name")}
        />
        <TextInput
          id="ec-relationship"
          labelText="Relationship"
          placeholder="e.g. Spouse, Parent"
          invalid={!!errors.emergencyContact?.relationship}
          invalidText={errors.emergencyContact?.relationship?.message}
          {...register("emergencyContact.relationship")}
        />
        <TextInput
          id="ec-phone"
          labelText="Phone Number"
          type="tel"
          placeholder="+256 700 000 000"
          invalid={!!errors.emergencyContact?.phone}
          invalidText={errors.emergencyContact?.phone?.message}
          {...register("emergencyContact.phone")}
        />
      </div>
    </Tile>
  );
};
