import { useState } from "react";
import { Member, MemberFormValues, MemberModalProps, MiniAssignmentDraft, Step, STEP_LABELS } from "@/churchTypes/memberTypes";
import { CELL_GROUPS, generateMemberId, MINISTRIES_LIST, MINISTRY_ROLES } from "@/utils/memberUtils";
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
    Tag,
    TextInput,
    Toggle
} from "@carbon/react";
import { SlideOver } from "@/components/ui/SlideOver";
    //validation shema
function validateStep0(form: Partial<MemberFormValues>): string[]{
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

const MemberModal = (

    {
        open,
        onClose,
        onSubmit,
        existingIds,
        isSubmitting = false,

    }:MemberModalProps
) => { 
    const [step, setStep] = useState<Step>(0)
    const [errors, setErrors] = useState<string[]>([])
    const [ministries, setMinistries] = useState<MiniAssignmentDraft[]>([]);
    
    const [form, setForm] = useState<Partial<MemberFormValues>>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: undefined,
    age: undefined,
    maritalStatus: "Single",
    status: "active",
    baptized: false,
    joinedAt: new Date().toISOString().split("T")[0],
    cellGroup: "",
    });
    
     const set = <K extends keyof MemberFormValues>(
    key: K,
    value: MemberFormValues[K]
    ) => setForm((prev) => ({ ...prev, [key]: value }));
    

     const handleNext = () => {
    const errs =
      step === 0
        ? validateStep0(form)
        : step === 1
        ? validateStep1(form)
        : [];
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
    setMinistries((prev) => [
      ...prev,
      { ministry: "Choir", role: "Member" },
    ]);
  };
 
  const removeMinistry = (i: number) =>
    setMinistries((prev) => prev.filter((_, idx) => idx !== i));
 
  const updateMinistry = (
    i: number,
    key: keyof MiniAssignmentDraft,
    value: string
  ) =>
    setMinistries((prev) =>
      prev.map((m, idx) =>
        idx === i ? { ...m, [key]: value } : m
      )
    );
 
     const handleSubmit = async () => {
    const errs = [...validateStep0(form), ...validateStep1(form)];
    if (errs.length) {
      setErrors(errs);
      setStep(errs.some((err) => err.includes("name") || err.includes("Phone") || err.includes("Gender") || err.includes("age")) ? 0 : 1);
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
      })), family: [],
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
    const handleClose = () => {
    setStep(0);
    setErrors([]);
    setMinistries([]);
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      gender: undefined,
      age: undefined,
      maritalStatus: "Single",
      status: "active",
      baptized: false,
      joinedAt: new Date().toISOString().split("T")[0],
      cellGroup: "",
    });
    onClose();
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
          <Button kind="secondary" onClick={step > 0 ? handleBack : handleClose} disabled={isSubmitting}>
            {step > 0 ? "Back" : "Cancel"}
          </Button>
          <Button onClick={step < 2 ? handleNext : handleSubmit} disabled={isSubmitting}>
            {step < 2 ? "Continue" : isSubmitting ? "Creating..." : "Create Member"}
          </Button>
        </>
      }
    >
      {/* Progress indicator */}
      <div style={{ marginBottom: "1.5rem" }}>
        <ProgressIndicator currentIndex={step} spaceEqually>
          {STEP_LABELS.map((label) => (
            <ProgressStep key={label} label={label} />
          ))}
        </ProgressIndicator>
      </div>
 
      {/* Errors */}
      {errors.length > 0 && (
        <InlineNotification
          kind="error"
          title="Please fix the following:"
          subtitle={errors.join(" ")}
          lowContrast
          style={{ marginBottom: "1rem" }}
        />
      )}
 
      {/* ── Step 0: Personal Info ── */}
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
 
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
 
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup legendText="Gender *">
              <RadioButtonGroup
                name="gender"
                valueSelected={form.gender}
                onChange={(val) => set("gender", val as MemberFormValues["gender"])}
                orientation="horizontal"
              >
                <RadioButton labelText="Male" value="male" id="gender-male" />
                <RadioButton labelText="Female" value="Female" id="gender-female" />
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
              set("maritalStatus", e.target.value as MemberFormValues["maritalStatus"])
            }
          >
            <SelectItem value="Single" text="Single" />
            <SelectItem value="Maried" text="Married" />
          </Select>
        </div>
      )}
 
      {/* ── Step 1: Church Details ── */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
            value={form.joinedAt}
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
        </div>
      )}
 
      {/* ── Step 2: Ministries ── */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ fontSize: "13px", color: "#6f6f6f", marginBottom: "0.5rem" }}>
            Assign this member to one or more ministries (optional — can be updated later).
          </p>
 
          {ministries.map((m, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: "0.75rem",
                alignItems: "flex-end",
                padding: "0.75rem",
                background: "#f4f4f4",
                borderRadius: "4px",
              }}
            >
              <Select
                id={`min-ministry-${i}`}
                labelText="Ministry"
                value={m.ministry}
                onChange={(e) =>
                  updateMinistry(i, "ministry", e.target.value)
                }
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
                style={{ marginBottom: "0" }}
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
              {ministries.map((m, i) => (
                <Tag key={i} type="blue" size="md">
                  {m.ministry} · {m.role}
                </Tag>
              ))}
            </div>
          )}
        </div>
      )}
    </SlideOver>
  );
}




export default MemberModal;
