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
import type { ChurchProfile, Gender } from "../../churchTypes/profile";

interface Props {
  profile: ChurchProfile;
  onChange: <K extends keyof ChurchProfile>(
    field: K,
    value: ChurchProfile[K],
  ) => void;
}

export const PersonalInfoSection: React.FC<Props> = ({ profile, onChange }) => {
  const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return (
    <Tile className="profile-section">
      <h2 className="profile-section__heading">
        <User size={20} aria-hidden /> Personal Information
      </h2>

      <div className="profile-field-grid">
        <TextInput
          id="p-firstName"
          labelText="First Name"
          placeholder="Enter first name"
          value={profile.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          required
        />
        <TextInput
          id="p-middleName"
          labelText="Middle Name"
          placeholder="Optional"
          value={profile.middleName}
          onChange={(e) => onChange("middleName", e.target.value)}
        />
        <TextInput
          id="p-lastName"
          labelText="Last Name"
          placeholder="Enter last name"
          value={profile.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          required
        />
        <DatePicker
          datePickerType="single"
          value={profile.dateOfBirth}
          onChange={([d]) => d && onChange("dateOfBirth", toIso(d))}
          maxDate={new Date().toLocaleDateString("en-US")}
        >
          <DatePickerInput
            id="p-dob"
            labelText="Date of Birth"
            placeholder="mm/dd/yyyy"
          />
        </DatePicker>

        <Select
          id="p-gender"
          labelText="Gender"
          value={profile.gender}
          onChange={(e) => onChange("gender", e.target.value as Gender)}
        >
          <SelectItem value="" text="Select gender" />
          <SelectItem value="male" text="Male" />
          <SelectItem value="female" text="Female" />
          <SelectItem value="prefer_not_to_say" text="Prefer not to say" />
        </Select>
        <TextInput
          id="p-nationality"
          labelText="Nationality"
          placeholder="e.g. Ugandan"
          value={profile.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
        />
        <TextInput
          id="p-nationalId"
          labelText="National ID / Passport No."
          placeholder="Enter ID number"
          value={profile.nationalId}
          onChange={(e) => onChange("nationalId", e.target.value)}
        />
      </div>
    </Tile>
  );
};
