import {
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
  Stack,
  Toggle,
} from "@carbon/react";
import type { MemberFormValues } from "@/features/members/types";
import { CELL_GROUPS } from "@/features/members/utils/memberUtils";
import styles from "./MemberModal.module.scss";

interface StepChurchInfoProps {
  form: Partial<MemberFormValues>;
  set: (
    key: keyof MemberFormValues,
    value: MemberFormValues[keyof MemberFormValues],
  ) => void;
}

export function StepChurchInfo({ form, set }: StepChurchInfoProps) {
  return (
    <Stack gap={5}>
      <Select
        id="status"
        labelText="Member Status *"
        value={form.status}
        onChange={(e) =>
          set("status", e.target.value as MemberFormValues["status"])
        }
      >
        {(
          [
            "active",
            "visitor",
            "New convert",
            "Inactive",
            "Transfered",
            "Suspended",
            "Deceased",
          ] as const
        ).map((s) => (
          <SelectItem key={s} value={s} text={s} />
        ))}
      </Select>

      <Select
        id="cellGroup"
        labelText="Cell Group *"
        value={form.cellGroup}
        onChange={(e) => set("cellGroup", e.target.value)}
      >
        <SelectItem disabled hidden value="" text="Choose a cell group" />
        {CELL_GROUPS.map((g) => (
          <SelectItem key={g} value={g} text={g} />
        ))}
      </Select>

      <DatePicker
        datePickerType="single"
        value={form.joinedAt ? new Date(form.joinedAt + "T00:00:00") : ""}
        onChange={([date]) => {
          if (date) set("joinedAt", date.toISOString().split("T")[0]);
        }}
      >
        <DatePickerInput
          id="joinedAt"
          labelText="Date Joined *"
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>

      <Toggle
        id="baptized"
        labelText="Baptized (SDA)"
        toggled={form.baptized}
        onToggle={(val) => set("baptized", val)}
        labelA="No"
        labelB="Yes"
      />
    </Stack>
  );
}
