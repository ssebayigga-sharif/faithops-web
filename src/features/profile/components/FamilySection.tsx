import React from "react";
import {
  TextInput,
  Select,
  SelectItem,
  NumberInput,
  Tile,
} from "@carbon/react";
import { Events } from "@carbon/icons-react";
import type { ChurchProfile } from "@/features/profile/types";
import type { MaritalStatus } from "@/shared/types";

interface Props {
  profile: ChurchProfile;
  onChange: <K extends keyof ChurchProfile>(
    field: K,
    value: ChurchProfile[K],
  ) => void;
  onNestedChange: (
    parent: "emergencyContact",
    field: string,
    value: string,
  ) => void;
}

export const FamilySection: React.FC<Props> = ({
  profile,
  onChange,
  onNestedChange,
}) => (
  <Tile className="profile-section">
    <h2 className="profile-section__heading">
      <Events size={20} aria-hidden /> Family &amp; Emergency Contact
    </h2>

    <div className="profile-field-grid">
      <Select
        id="f-marital"
        labelText="Marital Status"
        value={profile.maritalStatus}
        onChange={(e) =>
          onChange("maritalStatus", e.target.value as MaritalStatus)
        }
      >
        <SelectItem value="" text="Select status" />
        <SelectItem value="single" text="Single" />
        <SelectItem value="married" text="Married" />
        <SelectItem value="widowed" text="Widowed" />
        <SelectItem value="divorced" text="Divorced" />
      </Select>

      {profile.maritalStatus === "married" && (
        <TextInput
          id="f-spouse"
          labelText="Spouse's Full Name"
          placeholder="Enter spouse's name"
          value={profile.spouseName}
          onChange={(e) => onChange("spouseName", e.target.value)}
        />
      )}

      <NumberInput
        id="f-children"
        label="Number of Children"
        min={0}
        max={50}
        value={profile.numberOfChildren === "" ? 0 : profile.numberOfChildren}
        onChange={(_e, { value }) =>
          onChange("numberOfChildren", value === "" ? "" : Number(value))
        }
      />
    </div>

    <p className="ec-heading">Emergency Contact</p>

    <div className="profile-field-grid">
      <TextInput
        id="ec-name"
        labelText="Full Name"
        placeholder="Contact's full name"
        value={profile.emergencyContact.name}
        onChange={(e) =>
          onNestedChange("emergencyContact", "name", e.target.value)
        }
      />
      <TextInput
        id="ec-relationship"
        labelText="Relationship"
        placeholder="e.g. Spouse, Parent"
        value={profile.emergencyContact.relationship}
        onChange={(e) =>
          onNestedChange("emergencyContact", "relationship", e.target.value)
        }
      />
      <TextInput
        id="ec-phone"
        labelText="Phone Number"
        type="tel"
        placeholder="+256 700 000 000"
        value={profile.emergencyContact.phone}
        onChange={(e) =>
          onNestedChange("emergencyContact", "phone", e.target.value)
        }
      />
    </div>
  </Tile>
);
