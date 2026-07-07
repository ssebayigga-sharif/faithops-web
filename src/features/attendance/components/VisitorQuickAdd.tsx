import { TextInput, Button } from "@carbon/react";

interface VisitorQuickAddProps {
  name: string;
  phone: string;
  email: string;
  notes: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onAdd: () => void;
}

export function VisitorQuickAdd({
  name,
  phone,
  email,
  notes,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onNotesChange,
  onAdd,
}: VisitorQuickAddProps) {
  return (
    <div
      className="attendancepage__visitor"
      style={{
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      <TextInput
        id="visitor-name"
        labelText="Visitor Name"
        placeholder="Enter name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <TextInput
        id="visitor-phone"
        labelText="Phone"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
      />
      <TextInput
        id="visitor-email"
        labelText="Email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <TextInput
        id="visitor-notes"
        labelText="Notes"
        placeholder="Notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
      />
      <Button
        kind="secondary"
        size="sm"
        onClick={onAdd}
        disabled={!name.trim() || !phone.trim()}
      >
        Add Visitor
      </Button>
    </div>
  );
}

export default VisitorQuickAdd;
