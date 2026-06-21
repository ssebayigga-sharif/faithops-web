import { Search, Button } from "@carbon/react";
import { Reset } from "@carbon/icons-react";

interface MemberFiltersBarProps {
  search: string;
  onSearch: (value: string) => void;
  onReset: () => void;
}

export function MemberFiltersBar({
  search,
  onSearch,
  onReset,
}: MemberFiltersBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 0",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "0.5rem",
      }}
    >
      <div style={{ width: "70%" }}>
        <Search
          id="member-search"
          labelText="Search members"
          placeholder="Name, ID, or phone…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          size="md"
        />
      </div>

      {search && (
        <Button
          kind="ghost"
          renderIcon={Reset}
          size="md"
          onClick={onReset}
          style={{ flexShrink: 0 }}
        >
          Reset
        </Button>
      )}
    </div>
  );
}
export default MemberFiltersBar;
