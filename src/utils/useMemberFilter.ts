import { useState, useMemo } from "react";
import type {
  Member,
  MemberFilters,
  SortState,
} from "../churchTypes/memberTypes";
import { sortMembers, filterMembers, computeMembers } from "./memberUtils";

const DEFAULT_FILTERS: MemberFilters = {
  search: "",
  status: "",
  ministry: "",
  gender: "",
  baptized: "",
  attendance: "",
  cellGroup: "",
};

const DEFAULT_SORT: SortState = {
  field: "fullName",
  dir: "asc",
};

interface UseMemberFiltersReturn {
  filters: MemberFilters;
  sort: SortState;
  filteredMembers: Member[];
  totalCount: number;
  filteredCount: number;
  setFilter: <K extends keyof MemberFilters>(
    key: K,
    value: MemberFilters[K],
  ) => void;
  setSort: (field: SortState["field"]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useMemberFilters(rawMembers: Member[]): UseMemberFiltersReturn {
  const [filters, setFilters] = useState<MemberFilters>(DEFAULT_FILTERS);
  const [sort, setSortState] = useState<SortState>(DEFAULT_SORT);

  // Compute once — memoised
  const computedMembers = useMemo(
    () => computeMembers(rawMembers),
    [rawMembers],
  );

  const filteredMembers = useMemo(() => {
    const filtered = filterMembers(computedMembers, filters);
    return sortMembers(filtered, sort);
  }, [computedMembers, filters, sort]);

  const setFilter = <K extends keyof MemberFilters>(
    key: K,
    value: MemberFilters[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const setSort = (field: SortState["field"]) => {
    setSortState((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const hasActiveFilters = Object.entries(filters).some(
    ([key, val]) => key !== "search" && val !== "",
  );

  return {
    filters,
    sort,
    filteredMembers,
    totalCount: rawMembers.length,
    filteredCount: filteredMembers.length,
    setFilter,
    setSort,
    resetFilters,
    hasActiveFilters,
  };
}
