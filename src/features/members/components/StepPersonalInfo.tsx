import {
  FormGroup,
  RadioButtonGroup,
  RadioButton,
  NumberInput,
  Select,
  SelectItem,
  Stack,
  TextInput,
} from "@carbon/react";
import type { MemberFormValues } from "../types";
import styles from "./MemberModal.module.scss";

interface StepPersonalInfoProps {
  form: Partial<MemberFormValues>;
  set: (
    key: keyof MemberFormValues,
    value: MemberFormValues[keyof MemberFormValues],
  ) => void;
}

export function StepPersonalInfo({ form, set }: StepPersonalInfoProps) {
  return (
    <Stack gap={5}>
      <div className={styles.fieldRow}>
        <TextInput
          id="firstName"
          labelText="First Name *"
          value={form.firstName}
          onChange={(e) => set("firstName", e.target.value)}
          placeholder="e.g. Sarah"
        />
        <TextInput
          id="lastName"
          labelText="Last Name *"
          value={form.lastName}
          onChange={(e) => set("lastName", e.target.value)}
          placeholder="e.g. Nakato"
        />
      </div>

      <div className={styles.fieldRow}>
        <TextInput
          id="phone"
          labelText="Phone Number *"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+256 7XX XXX XXX"
        />
        <TextInput
          id="email"
          labelText="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="email@example.com"
        />
      </div>

      <div className={styles.fieldRow}>
        <FormGroup legendText="Gender *">
          <RadioButtonGroup
            name="gender"
            valueSelected={form.gender}
            onChange={(val) => set("gender", val as MemberFormValues["gender"])}
            orientation="vertical"
          >
            <RadioButton labelText="Male" value="male" id="gender-male" />
            <RadioButton labelText="Female" value="female" id="gender-female" />
            <RadioButton
              labelText="Prefer not to say"
              value="prefer_not_to_say"
              id="gender-prefer-not-to-say"
            />
          </RadioButtonGroup>
        </FormGroup>

        <NumberInput
          id="age"
          label="Age *"
          value={form.age ?? 0}
          min={1}
          max={120}
          onChange={(_e, { value }) => set("age", Number(value))}
        />
      </div>

      <Select
        id="maritalStatus"
        labelText="Marital Status"
        value={form.maritalStatus}
        onChange={(e) =>
          set(
            "maritalStatus",
            e.target.value as MemberFormValues["maritalStatus"],
          )
        }
      >
        <SelectItem value="single" text="Single" />
        <SelectItem value="married" text="Married" />
        <SelectItem value="widowed" text="Widowed" />
        <SelectItem value="divorced" text="Divorced" />
      </Select>
    </Stack>
  );
}
