import { Button } from "@carbon/react";
import { Add } from "@carbon/icons-react";

interface MembersEmptyStateProps {
  onAddMember: () => void;
}

export function MembersEmptyState({ onAddMember }: MembersEmptyStateProps) {
  return (
    <div
      style={{
        background: "var(--cds-layer-01, white)",
        border: "1px solid var(--cds-border-subtle-01, #e0e0e0)",
        padding: "4rem",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: 8 }}>
        No members yet
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "var(--cds-text-secondary, #6f6f6f)",
          marginBottom: "1.5rem",
        }}
      >
        Add your first church member to get started.
      </p>
      <Button renderIcon={Add} onClick={onAddMember}>
        Add First Member
      </Button>
    </div>
  );
}

export default MembersEmptyState;
