import { useState } from "react";
import type {
  Member,
  MemberFormValues,
  MemberModalProps,
  MiniAssignmentDraft,
  Step,
} from "../types";
import { STEP_LABELS } from "../data/members";
import { generateMemberId } from "../utils/memberUtils";
import { Add, TrashCan } from "@carbon/icons-react";
import {
  Button,
  InlineNotification,
  ProgressIndicator,
  ProgressStep,
} from "@carbon/react";
import { SlideOver } from "../../../shared/components/ui/SlideOver";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepChurchInfo } from "./StepChurchInfo";
import { StepMinistries } from "./StepMinistries";
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

  const addMinistry = () =>
    setMinistries((prev) => [...prev, { ministry: "Choir", role: "Member" }]);
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
      description="Create a complete member record with church details."
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

      {step === 0 && <StepPersonalInfo form={form} set={set} />}
      {step === 1 && <StepChurchInfo form={form} set={set} />}
      {step === 2 && (
        <StepMinistries
          ministries={ministries}
          addMinistry={addMinistry}
          removeMinistry={removeMinistry}
          updateMinistry={updateMinistry}
        />
      )}
    </SlideOver>
  );
};

export default MemberModal;
