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
  Button,
  InlineLoading,
} from "@carbon/react";
import { CheckmarkFilled, ErrorFilled, Save } from "@carbon/icons-react";
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
    <div className="attendance-mark-table">
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

            <Button
              kind="ghost"
              size="sm"
              onClick={() => onBulkMark("present")}
            >
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
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="attendance-empty">
                    <p className="attendance-empty__title">No members found</p>
                    <p className="attendance-empty__body">
                      Try a different search term.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, index) => (
                <TableRow key={row.memberId}>
                  <TableCell className="attendance-mark-table__cell-index">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className="attendance-mark-table__cell-name"
                    style={{ fontWeight: 500 }}
                  >
                    {row.memberName}
                  </TableCell>
                  <TableCell className="attendance-mark-table__cell-status">
                    <div className="attendance-mark-table__status-group">
                      <button
                        className={`attendance-mark-table__btn attendance-mark-table__btn--present ${
                          row.status === "present"
                            ? "attendance-mark-table__btn--active"
                            : ""
                        }`}
                        onClick={() =>
                          onRowChange(row.memberId, "status", "present")
                        }
                      >
                        <CheckmarkFilled size={16} />
                        <span>Present</span>
                      </button>
                      <button
                        className={`attendance-mark-table__btn attendance-mark-table__btn--absent ${
                          row.status === "absent"
                            ? "attendance-mark-table__btn--active"
                            : ""
                        }`}
                        onClick={() =>
                          onRowChange(row.memberId, "status", "absent")
                        }
                      >
                        <ErrorFilled size={16} />
                        <span>Absent</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MarkAttendanceTable;
