import React from "react";
import {
  TextInput,
  Select,
  SelectItem,
  DatePicker,
  DatePickerInput,
  Tile,
} from "@carbon/react";
import { Certificate } from "@carbon/icons-react";
import type {
  ChurchProfile,
  MembershipStatus,
  BaptismStatus,
} from "../../churchTypes/profile";

interface Props {
  profile: ChurchProfile;
  onChange: <K extends keyof ChurchProfile>(
    field: K,
    value: ChurchProfile[K],
  ) => void;
}

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const MembershipSection: React.FC<Props> = ({ profile, onChange }) => (
  <Tile className="profile-section">
    <h2 className="profile-section__heading">
      <Certificate size={20} aria-hidden /> Church Membership
    </h2>

    <div className="profile-field-grid">
      <Select
        id="m-status"
        labelText="Membership Status"
        value={profile.membershipStatus}
        onChange={(e) =>
          onChange("membershipStatus", e.target.value as MembershipStatus)
        }
      >
        <SelectItem value="active" text="Active Member" />
        <SelectItem value="inactive" text="Inactive Member" />
        <SelectItem value="visitor" text="Visitor" />
        <SelectItem value="transferred" text="Transferred" />
      </Select>

      <TextInput
        id="m-number"
        labelText="Membership Number"
        placeholder="e.g. MCM-2024-00123"
        helperText="Assigned by administrator"
        value={profile.membershipNumber}
        onChange={(e) => onChange("membershipNumber", e.target.value)}
      />

      <DatePicker
        datePickerType="single"
        value={profile.dateJoined}
        onChange={([d]) => d && onChange("dateJoined", toIso(d))}
        maxDate={new Date().toLocaleDateString("en-US")}
      >
        <DatePickerInput
          id="m-joined"
          labelText="Date Joined"
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>

      <Select
        id="m-baptism"
        labelText="Baptism Status"
        value={profile.baptismStatus}
        onChange={(e) =>
          onChange("baptismStatus", e.target.value as BaptismStatus)
        }
      >
        <SelectItem value="" text="Select status" />
        <SelectItem value="baptised" text="Baptised" />
        <SelectItem value="not_baptised" text="Not Baptised" />
        <SelectItem value="pending" text="Pending / Scheduled" />
      </Select>

      {profile.baptismStatus === "baptised" && (
        <DatePicker
          datePickerType="single"
          value={profile.baptismDate}
          onChange={([d]) => d && onChange("baptismDate", toIso(d))}
        >
          <DatePickerInput
            id="m-baptismDate"
            labelText="Baptism Date"
            placeholder="mm/dd/yyyy"
          />
        </DatePicker>
      )}

      <TextInput
        id="m-dept"
        labelText="Department"
        placeholder="e.g. Worship, Youth, Ushering"
        value={profile.department}
        onChange={(e) => onChange("department", e.target.value)}
      />
      <TextInput
        id="m-cell"
        labelText="Cell Group / Life Group"
        placeholder="e.g. Nakasero Zone A"
        value={profile.cellGroup}
        onChange={(e) => onChange("cellGroup", e.target.value)}
      />
      <TextInput
        id="m-service"
        labelText="Service Unit"
        placeholder="e.g. Sunday First Service"
        value={profile.serviceUnit}
        onChange={(e) => onChange("serviceUnit", e.target.value)}
      />
    </div>
  </Tile>
);
