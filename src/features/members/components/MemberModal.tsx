import { useState } from "react";
import type {
  Member,
  MemberFormValues,
  MemberModalProps,
  MiniAssignmentDraft,
  Step,
} from "@/features/members/types";
import { STEP_LABELS } from "@/features/members/data/members";
import {
  CELL_GROUPS,
  generateMemberId,
  MINISTRIES_LIST,
  MINISTRY_ROLES,
} from "@/features/members/utils/memberUtils";
import { Add, TrashCan } from "@carbon/icons-react";
import {
  Button,
  RadioButton,
  DatePicker,
  DatePickerInput,
  FormGroup,
  InlineNotification,
  NumberInput,
  ProgressIndicator,
  ProgressStep,
  RadioButtonGroup,
  Select,
  SelectItem,
  Stack,
  Tag,
  TextInput,
  Toggle,
} from "@carbon/react";
import { SlideOver } from "@/shared/components/ui/SlideOver";
import styles from "./MemberModal.module.scss";

const DEFAULT_FORM_VALUES: Partial<MemberFormValues> = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  gender: undefined,
  age: undefined,
  maritalStatus: "single",
  status: "active",
  baptized: false,
  joinedAt: new Date().toISOString().split("T")[0],
  cellGroup: "",
};

function validateStep0(form: Partial<MemberFormValues>): string[] {
  const errs: string[] = [];
  if (!form.firstName?.trim()) errs.push("First name is required.");
  if (!form.lastName?.trim()) errs.push("Last name is required.");
  if (!form.phone?.trim()) errs.push("Phone number is required.");
  if (!form.gender) errs.push("Gender is required.");
  if (!form.age || form.age < 1) errs.push("Valid age is required.");
  return errs;
}

function validateStep1(form: Partial<MemberFormValues>): string[] {
  const errs: string[] = [];
  if (!form.status) errs.push("Member status is required.");
  if (!form.cellGroup) errs.push("Cell group is required.");
  if (!form.joinedAt) errs.push("Join date is required.");
  return errs;
}

function ErrorList({ errors }: { errors: string[] }) {
  return (
    <ul className={styles.errorList}>
      {errors.map((err) => (
        <li key={err}>{err}</li>
      ))}
    </ul>
  );
}

const MemberModal = ({
  open,
  onClose,
  onSubmit,
  existingIds,
  isSubmitting = false,
}: MemberModalProps) => {
  const [step, setStep] = useState<Step>(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [ministries, setMinistries] = useState<MiniAssignmentDraft[]>([]);
  const [form, setForm] =
    useState<Partial<MemberFormValues>>(DEFAULT_FORM_VALUES);

  const set = <K extends keyof MemberFormValues>(
    key: K,
    value: MemberFormValues[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleNext = () => {
    const errs =
      step === 0 ? validateStep0(form) : step === 1 ? validateStep1(form) : [];
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setStep((s) => (s < 2 ? ((s + 1) as Step) : s));
  };

  const handleBack = () => {
    setErrors([]);
    setStep((s) => (s > 0 ? ((s - 1) as Step) : s));
  };

  const addMinistry = () => {
    setMinistries((prev) => [...prev, { ministry: "Choir", role: "Member" }]);
  };

  const removeMinistry = (i: number) =>
    setMinistries((prev) => prev.filter((_, idx) => idx !== i));

  const updateMinistry = (
    i: number,
    key: keyof MiniAssignmentDraft,
    value: string,
  ) =>
    setMinistries((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)),
    );

  const handleClose = () => {
    setStep(0);
    setErrors([]);
    setMinistries([]);
    setForm(DEFAULT_FORM_VALUES);
    onClose();
  };

  const handleSubmit = async () => {
    const errs = [...validateStep0(form), ...validateStep1(form)];
    if (errs.length) {
      setErrors(errs);
      setStep(
        errs.some(
          (err) =>
            err.includes("name") ||
            err.includes("Phone") ||
            err.includes("Gender") ||
            err.includes("age"),
        )
          ? 0
          : 1,
      );
      return;
    }

    const newId = generateMemberId(existingIds);
    const now = new Date().toISOString();

    const member: Member = {
      id: newId,
      firstName: form.firstName!,
      lastName: form.lastName!,
      gender: form.gender!,
      age: form.age!,
      maritalStatus: form.maritalStatus!,
      phone: form.phone!,
      email: form.email ?? "",
      status: form.status!,
      baptized: form.baptized!,
      joinedAt: form.joinedAt!,
      cellGroup: form.cellGroup!,
      ministries: ministries.map((m) => ({
        ministry: m.ministry,
        role: m.role,
        joinedAt: now,
        active: true,
      })),
      family: [],
      attendance: [],
      giving: [],
      followUps: [],
      notes: [],
      timeline: [
        {
          id: crypto.randomUUID(),
          type: "joined",
          description: `${form.firstName} ${form.lastName} joined the church.`,
          date: now,
        },
      ],
    };

    await onSubmit(member);
    handleClose();
  };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title="Add New Member"
      eyebrow="Membership"
      description="Create a complete member record with church details, ministry assignments, and a timeline entry."
      width="lg"
      footer={
        <>
          <Button
            kind="secondary"
            onClick={step > 0 ? handleBack : handleClose}
            disabled={isSubmitting}
          >
            {step > 0 ? "Back" : "Cancel"}
          </Button>
          <Button
            onClick={step < 2 ? handleNext : handleSubmit}
            disabled={isSubmitting}
          >
            {step < 2
              ? "Continue"
              : isSubmitting
                ? "Creating..."
                : "Create Member"}
          </Button>
        </>
      }
    >
      <div className={styles.progress}>
        <ProgressIndicator currentIndex={step} spaceEqually>
          {STEP_LABELS.map((label) => (
            <ProgressStep key={label} label={label} />
          ))}
        </ProgressIndicator>
      </div>

      {errors.length > 0 && (
        <InlineNotification
          kind="error"
          title="Please fix the following:"
          subtitle={errors.join(".")}
          lowContrast
          className={styles.errorNotification}
        />
      )}

      {/* ── Step 0: Personal Info ── */}
      {step === 0 && (
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
                onChange={(val) =>
                  set("gender", val as MemberFormValues["gender"])
                }
                orientation="vertical"
              >
                <RadioButton labelText="Male" value="male" id="gender-male" />
                <RadioButton
                  labelText="Female"
                  value="female"
                  id="gender-female"
                />
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
      )}

      {/* ── Step 1: Church Details ── */}
      {step === 1 && (
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
      )}

      {/* ── Step 2: Ministries ── */}
      {step === 2 && (
        <Stack gap={5}>
          <p className={styles.helperText}>
            Assign this member to one or more ministries (optional — can be
            updated later).
          </p>

          {ministries.map((m, i) => (
            <div key={i} className={styles.ministryRow}>
              <Select
                id={`min-ministry-${i}`}
                labelText="Ministry"
                value={m.ministry}
                onChange={(e) => updateMinistry(i, "ministry", e.target.value)}
              >
                {MINISTRIES_LIST.map((min) => (
                  <SelectItem key={min} value={min} text={min} />
                ))}
              </Select>

              <Select
                id={`min-role-${i}`}
                labelText="Role"
                value={m.role}
                onChange={(e) => updateMinistry(i, "role", e.target.value)}
              >
                {MINISTRY_ROLES.map((r) => (
                  <SelectItem key={r} value={r} text={r} />
                ))}
              </Select>

              <Button
                kind="ghost"
                size="md"
                hasIconOnly
                renderIcon={TrashCan}
                iconDescription="Remove"
                onClick={() => removeMinistry(i)}
                className={styles.removeButton}
              />
            </div>
          ))}

          <Button
            kind="tertiary"
            renderIcon={Add}
            size="sm"
            onClick={addMinistry}
          >
            Add Ministry Assignment
          </Button>

          {ministries.length > 0 && (
            <div className={styles.ministryTags}>
              {ministries.map((m, i) => (
                <Tag key={i} type="blue" size="md">
                  {m.ministry} · {m.role}
                </Tag>
              ))}
            </div>
          )}
        </Stack>
      )}
    </SlideOver>
  );
};

export default MemberModal;
