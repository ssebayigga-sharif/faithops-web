import { useState, useMemo } from "react";
import type {
  Member,
  MemberFilters,
  SortState,
} from "@/features/members/types";
import {
  sortMembers,
  filterMembers,
  computeMembers,
} from "../utils/memberUtils";

const DEFAULT_FILTERS: MemberFilters = {
  search: "",
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

  const hasActiveFilters = filters.search !== "";

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
