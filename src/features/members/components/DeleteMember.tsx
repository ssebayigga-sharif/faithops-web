import { Modal } from "@carbon/react";
import type { Member } from "../types";

function ConfirmModalDeleted({
  member,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  member: Member | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div>
      <Modal
        open={!!member}
        danger
        modalHeading="Remove Member"
        primaryButtonText={isDeleting ? "Removing…" : "Remove Member"}
        secondaryButtonText="Cancel"
        onRequestSubmit={onConfirm}
        onSecondarySubmit={onCancel}
        onRequestClose={onCancel}
        primaryButtonDisabled={isDeleting}
      >
        <p style={{ fontSize: "14px", color: "#525252" }}>
          Are you sure you want to permanently remove{" "}
          <strong>
            {member?.firstName} {member?.lastName}
          </strong>{" "}
          from the register? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default ConfirmModalDeleted;
