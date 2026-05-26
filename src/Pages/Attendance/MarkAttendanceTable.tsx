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
import type { AttendanceRow, AttendanceStatus } from "./attendance";

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

const STATUS_ICONS: Record<AttendanceStatus, React.ReactNode> = {
  present: <CheckmarkFilled size={14} />,
  late: <Time size={14} />,
  absent: <ErrorFilled size={14} />,
  excused: <Misuse size={14} />,
};

const STATUS_TAG_TYPES: Record<
  AttendanceStatus,
  React.ComponentProps<typeof Tag>["type"]
> = {
  present: "green",
  late: "warm-gray",
  absent: "red",
  excused: "blue",
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
  const isDirty = rows.some((r) => r.status !== "absent"); // default is absent

  return (
    <TableContainer
      title="Mark Attendance"
      description={`${presentCount} of ${rows.length} members marked present`}
    >
      <TableToolbar>
        <TableToolbarContent>
          <TableToolbarSearch
            className="attendance-table__toolbar-search"
            placeholder="Search member…"
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            persistent
          />

          {/* Bulk action buttons */}
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
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <InlineLoading description="Saving…" />
            ) : (
              "Save Attendance"
            )}
          </Button>
        </TableToolbarContent>
      </TableToolbar>

      <Table size="lg" useZebraStyles>
        <TableHead>
          <TableRow>
            <TableHeader>Member</TableHeader>
            <TableHeader>Department</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Notes</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="attendance-empty">
                  <p className="attendance-empty__title">No members found</p>
                  <p className="attendance-empty__body">
                    Try a different search term.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row) => (
              <TableRow key={row.memberId}>
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
                    <Tag type={STATUS_TAG_TYPES[row.status]} size="sm">
                      {STATUS_ICONS[row.status]}
                    </Tag>
                  </div>
                </TableCell>
                <TableCell>
                  <TextInput
                    id={`notes-${row.memberId}`}
                    labelText=""
                    hideLabel
                    size="sm"
                    placeholder="Optional note…"
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
