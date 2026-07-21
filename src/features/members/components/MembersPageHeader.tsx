import { Button } from "@carbon/react";
import { Add } from "@carbon/icons-react";

interface MembersPageHeaderProps {
  totalCount: number;
  isLoading: boolean;
  filteredCount: number;
  hasActiveFilters: boolean;
  onAddMember: () => void;
}

export function MembersPageHeader({
  totalCount,
  isLoading,
  filteredCount,
  hasActiveFilters,
  onAddMember,
}: MembersPageHeaderProps) {
  return (
    <header className="admin-page__header">
      <div>
        <h1 className="admin-page__title">Church Membership Register</h1>
        <p className="admin-page__subtitle">
          Kabulengwa SDA Church ·{" "}
          {isLoading
            ? "Loading…"
            : `${totalCount.toLocaleString()} total members`}
        </p>
        {hasActiveFilters && (
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--cds-text-secondary, #6f6f6f)",
              marginTop: "0.25rem",
            }}
          >
            Showing {filteredCount.toLocaleString()} of{" "}
            {totalCount.toLocaleString()} members
          </p>
        )}
      </div>

      <div className="admin-actions">
        <Button
          kind="primary"
          renderIcon={Add}
          size="md"
          onClick={onAddMember}
          disabled={isLoading}
        >
          Add Member
        </Button>
      </div>
    </header>
  );
}

export default MembersPageHeader;
