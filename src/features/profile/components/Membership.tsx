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

export const MembershipSection: React.FC<Props> = ({
  readOnly,
  profile,
  register,
  errors,
  control,
}) => {
  const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const formatStatus = (s?: string) => {
    if (!s) return "—";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const formatBaptism = (b?: string) => {
    if (!b) return "—";
    if (b === "baptised") return "Baptised";
    if (b === "not_baptised") return "Not Baptised";
    if (b === "pending") return "Pending / Scheduled";
    return b;
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
          <Certificate size={20} aria-hidden /> Church Membership
        </h2>
        <div className="profile-view-grid">
          <div className="profile-view-item">
            <span className="profile-view-label">Membership Status</span>
            <span className="profile-view-value">
              {formatStatus(profile.membershipStatus)}
            </span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Date Joined</span>
            <span className="profile-view-value">
              {formatDate(profile.dateJoined)}
            </span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Baptism Status</span>
            <span className="profile-view-value">
              {formatBaptism(profile.baptismStatus)}
            </span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Department</span>
            <span className="profile-view-value">
              {profile.department || "—"}
            </span>
          </div>
          <div className="profile-view-item">
            <span className="profile-view-label">Cell Group / Life Group</span>
            <span className="profile-view-value">
              {profile.cellGroup || "—"}
            </span>
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
        <Certificate size={20} aria-hidden /> Church Membership
      </h2>

      <div className="profile-field-grid">
        <Controller
          name="membershipStatus"
          control={control}
          render={({ field }) => (
            <Select
              id="m-status"
              labelText="Membership Status"
              invalid={!!errors.membershipStatus}
              invalidText={errors.membershipStatus?.message}
              {...field}
            >
              <SelectItem value="active" text="Active Member" />
              <SelectItem value="inactive" text="Inactive Member" />
              <SelectItem value="visitor" text="Visitor" />
              <SelectItem value="transferred" text="Transferred" />
            </Select>
          )}
        />

        <Controller
          name="dateJoined"
          control={control}
          render={({ field: { onChange, value } }) => {
            // Carbon DatePicker expects a Date object, not an ISO string
            const dateValue = value ? new Date(value + "T00:00:00") : "";
            return (
              <DatePicker
                datePickerType="single"
                value={dateValue}
                onChange={([d]) => d && onChange(toIso(d))}
                maxDate={new Date().toLocaleDateString("en-US")}
              >
                <DatePickerInput
                  id="m-joined"
                  labelText="Date Joined"
                  placeholder="mm/dd/yyyy"
                  invalid={!!errors.dateJoined}
                  invalidText={errors.dateJoined?.message}
                />
              </DatePicker>
            );
          }}
        />

        <Controller
          name="baptismStatus"
          control={control}
          render={({ field }) => (
            <Select
              id="m-baptism"
              labelText="Baptism Status"
              invalid={!!errors.baptismStatus}
              invalidText={errors.baptismStatus?.message}
              {...field}
            >
              <SelectItem value="" text="Select status" />
              <SelectItem value="baptised" text="Baptised" />
              <SelectItem value="not_baptised" text="Not Baptised" />
              <SelectItem value="pending" text="Pending / Scheduled" />
            </Select>
          )}
        />

        <TextInput
          id="m-dept"
          labelText="Department"
          placeholder="e.g. Worship, Youth, Ushering"
          invalid={!!errors.department}
          invalidText={errors.department?.message}
          {...register("department")}
        />
        <TextInput
          id="m-cell"
          labelText="Cell Group / Life Group"
          placeholder="e.g. Nakasero Zone A"
          invalid={!!errors.cellGroup}
          invalidText={errors.cellGroup?.message}
          {...register("cellGroup")}
        />
      </div>
    </Tile>
  );
};
export default MembershipSection;
