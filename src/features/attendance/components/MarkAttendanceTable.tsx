import React, { useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Select,
  SelectItem,
  TextInput,
  Button,
  Tag,
  InlineLoading,
} from "@carbon/react";
import {
  CheckmarkFilled,
  Time,
  ErrorFilled,
  Misuse,
  Save,
} from "@carbon/icons-react";
import type {
  AttendanceRow,
  AttendanceStatus,
} from "@/features/attendance/types";

interface Props {
  rows: AttendanceRow[];
  isSaving: boolean;
  onRowChange: (
    memberId: string,
    field: keyof AttendanceRow,
    value: string,
  ) => void;
  onBulkMark: (status: AttendanceStatus) => void;
  onSave: () => void;
}

const STATUS_TAG_MAP: Record<
  AttendanceStatus,
  { type: "green" | "warm-gray" | "red" | "blue"; icon: React.ReactNode }
> = {
  present: { type: "green", icon: <CheckmarkFilled size={14} /> },
  late: { type: "warm-gray", icon: <Time size={14} /> },
  absent: { type: "red", icon: <ErrorFilled size={14} /> },
  excused: { type: "blue", icon: <Misuse size={14} /> },
};

export const MarkAttendanceTable: React.FC<Props> = ({
  rows,
  isSaving,
  onRowChange,
  onBulkMark,
  onSave,
}) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        r.memberName.toLowerCase().includes(search.toLowerCase()),
      ),
    [rows, search],
  );

  const presentCount = rows.filter((r) => r.status === "present").length;
  const totalCount = rows.length;
  const hasRows = rows.length > 0;

  return (
    <TableContainer
      title="Mark Attendance"
      description={`${presentCount} of ${totalCount} members present`}
    >
      <TableToolbar>
        <TableToolbarContent>
          <TableToolbarSearch
            className="attendance-table__toolbar-search"
            placeholder="Search member..."
            value={search}
            onChange={(_event, value?: string) => setSearch(value ?? "")}
            persistent
          />

          <Button kind="ghost" size="sm" onClick={() => onBulkMark("present")}>
            All Present
          </Button>
          <Button kind="ghost" size="sm" onClick={() => onBulkMark("absent")}>
            All Absent
          </Button>

          <Button
            kind="primary"
            size="sm"
            renderIcon={isSaving ? undefined : Save}
            onClick={onSave}
            disabled={isSaving || !hasRows}
          >
            {isSaving ? (
              <InlineLoading description="Saving..." />
            ) : (
              "Save Attendance"
            )}
          </Button>
        </TableToolbarContent>
      </TableToolbar>

      <Table size="lg" useZebraStyles>
        <TableHead>
          <TableRow>
            <TableHeader>#</TableHeader>
            <TableHeader>Member</TableHeader>
            <TableHeader>Department</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Notes</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="attendance-empty">
                  <p className="attendance-empty__title">No members found</p>
                  <p className="attendance-empty__body">
                    Try a different search term or seed members from the Members
                    page.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row, index) => (
              <TableRow key={row.memberId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.memberName}</TableCell>
                <TableCell>{row.department || "—"}</TableCell>
                <TableCell>
                  <div className="attendance-table__status-cell">
                    <Select
                      id={`status-${row.memberId}`}
                      labelText=""
                      hideLabel
                      size="sm"
                      value={row.status}
                      onChange={(e) =>
                        onRowChange(row.memberId, "status", e.target.value)
                      }
                      style={{ width: 130 }}
                    >
                      <SelectItem value="present" text="Present" />
                      <SelectItem value="late" text="Late" />
                      <SelectItem value="absent" text="Absent" />
                      <SelectItem value="excused" text="Excused" />
                    </Select>
                    <Tag type={STATUS_TAG_MAP[row.status].type} size="sm">
                      {STATUS_TAG_MAP[row.status].icon} {row.status}
                    </Tag>
                  </div>
                </TableCell>
                <TableCell>
                  <TextInput
                    id={`notes-${row.memberId}`}
                    labelText=""
                    hideLabel
                    size="sm"
                    placeholder="Optional note..."
                    value={row.notes}
                    onChange={(e) =>
                      onRowChange(row.memberId, "notes", e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
