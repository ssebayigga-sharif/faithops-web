import React from "react";
import { TextInput, Tile } from "@carbon/react";
import { Location } from "@carbon/icons-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProfileFormValues } from "../types";

interface Props {
  readOnly: boolean;
  profile: Partial<ProfileFormValues>;
  register?: UseFormRegister<ProfileFormValues>;
  errors?: FieldErrors<ProfileFormValues>;
}

export const ContactInfoSection: React.FC<Props> = ({
  readOnly,
  profile,
  register,
  errors,
}) => {
  if (readOnly) {
    return (
      <Tile className="profile-section">
        <h2 className="profile-section__heading">
          <Location size={20} aria-hidden /> Contact &amp; Address
        </h2>
        <div className="profile-view-grid">
          <div className="profile-view-item">
            <span className="profile-view-label">Email Address</span>
            <span className="profile-view-value">{profile.email || "—"}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Primary Phone</span>
            <span className="profile-view-value">{profile.phone || "—"}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">City / Town</span>
            <span className="profile-view-value">{profile.city || "—"}</span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Country</span>
            <span className="profile-view-value">{profile.country || "—"}</span>
          </div>
          <div className="profile-view-item" style={{ gridColumn: "span 2" }}>
            <span className="profile-view-label">Physical Address</span>
            <span className="profile-view-value">{profile.address || "—"}</span>
          </div>
        </div>
      </Tile>
    );
  }

  // Edit Mode
  if (!register || !errors) return null;

  return (
    <Tile className="profile-section">
      <h2 className="profile-section__heading">
        <Location size={20} aria-hidden /> Contact &amp; Address
      </h2>

      <div className="profile-field-grid">
        <TextInput
          id="c-email"
          labelText="Email Address *"
          type="email"
          placeholder="member@example.com"
          invalid={!!errors.email}
          invalidText={errors.email?.message}
          {...register("email")}
        />
        <TextInput
          id="c-phone"
          labelText="Primary Phone *"
          type="tel"
          placeholder="+256 700 000 000"
          invalid={!!errors.phone}
          invalidText={errors.phone?.message}
          {...register("phone")}
        />
        <TextInput
          id="c-city"
          labelText="City / Town"
          placeholder="e.g. Kampala"
          invalid={!!errors.city}
          invalidText={errors.city?.message}
          {...register("city")}
        />
        <TextInput
          id="c-country"
          labelText="Country"
          placeholder="e.g. Uganda"
          invalid={!!errors.country}
          invalidText={errors.country?.message}
          {...register("country")}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <TextInput
          id="c-address"
          labelText="Physical Address"
          placeholder="Street, building, plot number…"
          invalid={!!errors.address}
          invalidText={errors.address?.message}
          {...register("address")}
        />
      </div>
    </Tile>
  );
};
