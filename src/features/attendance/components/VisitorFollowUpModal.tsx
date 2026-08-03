import { Modal, Select, SelectItem } from "@carbon/react";
import type { VisitorRecord } from "../types";

interface VisitorFollowUpModalProps {
  open: boolean;
  visitor: VisitorRecord | null;
  onClose: () => void;
  onSubmit: () => void;
  onStatusChange: (status: VisitorRecord["followUpStatus"]) => void;
}

export function VisitorFollowUpModal({
  open,
  visitor,
  onClose,
  onSubmit,
  onStatusChange,
}: VisitorFollowUpModalProps) {
  return (
    <Modal
      open={open}
      modalHeading={`Follow-Up: ${visitor?.name ?? ""}`}
      primaryButtonText="Update"
      secondaryButtonText="Cancel"
      onRequestClose={onClose}
      onRequestSubmit={onSubmit}
    >
      <p>Update follow-up status for {visitor?.name}.</p>
      <Select
        id="visitor-followup-status"
        labelText="Follow-Up Status"
        value={visitor?.followUpStatus ?? "pending"}
        onChange={(e) =>
          onStatusChange(e.target.value as VisitorRecord["followUpStatus"])
        }
      >
        <SelectItem value="pending" text="Pending" />
        <SelectItem value="contacted" text="Contacted" />
        <SelectItem value="converted" text="Converted" />
        <SelectItem value="no_interest" text="No Interest" />
      </Select>
    </Modal>
  );
}

export default VisitorFollowUpModal;
