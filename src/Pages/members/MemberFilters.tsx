"use client";

import {
  Search,
  Select,
  SelectItem,
  Button,
  Tag,
} from "@carbon/react";
import { Reset } from "@carbon/icons-react";
import type { MemberFilters, MemberStatus, Ministry, Gender } from "@/churchTypes/memberTypes";
import { CELL_GROUPS, MINISTRIES_LIST } from "@/utils/memberUtils";

interface MemberFiltersBarProps {
  filters: MemberFilters;
  hasActiveFilters: boolean;
  onFilter: <K extends keyof MemberFilters>(key: K, value: MemberFilters[K]) => void;
  onReset: () => void;
}

const STATUSES: MemberStatus[] = [
  "active",
  "visitor",
  "New convert",
  "Inactive",
  "Transfered",
  "Suspended",
  "Deceased",
];

export function MemberFiltersBar({
  filters,
  hasActiveFilters,
  onFilter,
  onReset,
}: MemberFiltersBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "0.75rem 0",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "0.5rem",
      }}
    >
      {/* Row 1: Search + dropdowns */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 220px" }}>
          <Search
            id="member-search"
            labelText="Search members"
            placeholder="Name, ID, or phone…"
            value={filters.search}
            onChange={(e) => onFilter("search", e.target.value)}
            size="md"
          />
        </div>

        <Select
          id="filter-status"
          labelText="Status"
          value={filters.status}
          onChange={(e) => onFilter("status", e.target.value as MemberStatus | "")}
          style={{ minWidth: 140 }}
        >
          <SelectItem value="" text="All statuses" />
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s} text={s} />
          ))}
        </Select>

        <Select
          id="filter-ministry"
          labelText="Ministry"
          value={filters.ministry}
          onChange={(e) => onFilter("ministry", e.target.value as Ministry | "")}
          style={{ minWidth: 140 }}
        >
          <SelectItem value="" text="All ministries" />
          {MINISTRIES_LIST.map((m: Ministry) => (
            <SelectItem key={m} value={m} text={m} />
          ))}
        </Select>

        <Select
          id="filter-gender"
          labelText="Gender"
          value={filters.gender}
          onChange={(e) => onFilter("gender", e.target.value as Gender | "")}
          style={{ minWidth: 120 }}
        >
          <SelectItem value="" text="All genders" />
          <SelectItem value="male" text="Male" />
          <SelectItem value="Female" text="Female" />
        </Select>

        <Select
          id="filter-cellgroup"
          labelText="Cell Group"
          value={filters.cellGroup}
          onChange={(e) => onFilter("cellGroup", e.target.value)}
          style={{ minWidth: 140 }}
        >
          <SelectItem value="" text="All cell groups" />
          {CELL_GROUPS.map((g) => (
            <SelectItem key={g} value={g} text={g} />
          ))}
        </Select>

        <Select
          id="filter-attendance"
          labelText="Attendance"
          value={filters.attendance}
          onChange={(e) =>
            onFilter("attendance", e.target.value as MemberFilters["attendance"])
          }
          style={{ minWidth: 140 }}
        >
          <SelectItem value="" text="Any attendance" />
          <SelectItem value="high" text="High (≥75%)" />
          <SelectItem value="medium" text="Medium (40–74%)" />
          <SelectItem value="low" text="Low (1–39%)" />
          <SelectItem value="missing" text="Missing (0%)" />
        </Select>

        <Select
          id="filter-baptized"
          labelText="Baptized"
          value={filters.baptized}
          onChange={(e) =>
            onFilter("baptized", e.target.value as MemberFilters["baptized"])
          }
          style={{ minWidth: 120 }}
        >
          <SelectItem value="" text="Any" />
          <SelectItem value="yes" text="Yes" />
          <SelectItem value="no" text="No" />
        </Select>

        {hasActiveFilters && (
          <Button
            kind="ghost"
            renderIcon={Reset}
            size="md"
            onClick={onReset}
            style={{ flexShrink: 0 }}
          >
            Reset filters
          </Button>
        )}
      </div>

      {/* Row 2: Active filter tags */}
      {hasActiveFilters && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
          <span style={{ fontSize: "11.5px", color: "#6f6f6f", marginRight: 4 }}>
            Active filters:
          </span>
          {filters.status && (
            <Tag
              type="blue"
              filter
              onClose={() => onFilter("status", "")}
              title="Remove status filter"
            >
              Status: {filters.status}
            </Tag>
          )}
          {filters.ministry && (
            <Tag
              type="teal"
              filter
              onClose={() => onFilter("ministry", "")}
              title="Remove ministry filter"
            >
              Ministry: {filters.ministry}
            </Tag>
          )}
          {filters.gender && (
            <Tag
              type="purple"
              filter
              onClose={() => onFilter("gender", "")}
              title="Remove gender filter"
            >
              Gender: {filters.gender}
            </Tag>
          )}
          {filters.cellGroup && (
            <Tag
              type="cyan"
              filter
              onClose={() => onFilter("cellGroup", "")}
              title="Remove cell group filter"
            >
              Cell: {filters.cellGroup}
            </Tag>
          )}
          {filters.attendance && (
            <Tag
              type="warm-gray"
              filter
              onClose={() => onFilter("attendance", "")}
              title="Remove attendance filter"
            >
              Attendance: {filters.attendance}
            </Tag>
          )}
          {filters.baptized && (
            <Tag
              type="green"
              filter
              onClose={() => onFilter("baptized", "")}
              title="Remove baptized filter"
            >
              Baptized: {filters.baptized}
            </Tag>
          )}
        </div>
      )}
    </div>
  );
}
export default MemberFiltersBar;