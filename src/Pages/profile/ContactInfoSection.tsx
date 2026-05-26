import React from "react";
import { TextInput, TextArea, Tile } from "@carbon/react";
import { Location } from "@carbon/icons-react";
import type { ChurchProfile } from "../../churchTypes/profile";

interface Props {
  profile: ChurchProfile;
  onChange: <K extends keyof ChurchProfile>(
    field: K,
    value: ChurchProfile[K],
  ) => void;
}

export const ContactInfoSection: React.FC<Props> = ({ profile, onChange }) => (
  <Tile className="profile-section">
    <h2 className="profile-section__heading">
      <Location size={20} aria-hidden /> Contact &amp; Address
    </h2>

    <div className="profile-field-grid">
      <TextInput
        id="c-email"
        labelText="Email Address"
        type="email"
        placeholder="member@example.com"
        value={profile.email}
        onChange={(e) => onChange("email", e.target.value)}
        required
      />
      <TextInput
        id="c-phone"
        labelText="Primary Phone"
        type="tel"
        placeholder="+256 700 000 000"
        value={profile.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        required
      />
      <TextInput
        id="c-altPhone"
        labelText="Alternate Phone"
        type="tel"
        placeholder="Optional"
        value={profile.alternatePhone}
        onChange={(e) => onChange("alternatePhone", e.target.value)}
      />
      <TextInput
        id="c-city"
        labelText="City / Town"
        placeholder="e.g. Kampala"
        value={profile.city}
        onChange={(e) => onChange("city", e.target.value)}
      />
      <TextInput
        id="c-country"
        labelText="Country"
        placeholder="e.g. Uganda"
        value={profile.country}
        onChange={(e) => onChange("country", e.target.value)}
      />
      <TextInput
        id="c-postal"
        labelText="Postal Code"
        placeholder="e.g. 10101"
        value={profile.postalCode}
        onChange={(e) => onChange("postalCode", e.target.value)}
      />
    </div>

    <div style={{ marginTop: "1rem" }}>
      <TextArea
        id="c-address"
        labelText="Physical Address"
        placeholder="Street, building, plot number…"
        value={profile.address}
        onChange={(e) => onChange("address", e.target.value)}
        rows={3}
      />
    </div>
  </Tile>
);
