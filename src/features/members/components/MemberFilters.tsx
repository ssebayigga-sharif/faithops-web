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
    <div className="members-filters">
      <div className="members-filters__search">
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
          className="members-filters__reset"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
export default MemberFiltersBar;
