import React, { useState } from "react";
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
  Modal,
  Tag,
  DataTableSkeleton,
} from "@carbon/react";
import { TrashCan, View } from "@carbon/icons-react";
import type { AttendanceSession as Session } from "../types";
import {
  useSessionRecords,
  useDeleteSession,
} from "../hooks/useAttendance";

interface Props {
  sessions: Session[];
  isLoading: boolean;
}

export const SessionHistoryTable: React.FC<Props> = ({
  sessions,
  isLoading,
}) => {
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: records = [], isLoading: recordsLoading } =
    useSessionRecords(viewId);
  const deleteMutation = useDeleteSession();

  const filtered = sessions.filter(
    (s) =>
      s.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      s.date.includes(search),
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  if (isLoading) return <DataTableSkeleton columnCount={6} rowCount={5} />;

  return (
    <>
      <TableContainer
        title="Session History"
        description="All recorded attendance sessions"
      >
        <TableToolbar>
          <TableToolbarContent>
            <TableToolbarSearch
              placeholder="Search by date or service..."
              value={search}
              onChange={(_event, value?: string) => setSearch(value ?? "")}
              persistent
            />
          </TableToolbarContent>
        </TableToolbar>

        <Table size="lg" useZebraStyles>
          <TableHead>
            <TableRow>
              <TableHeader>Date</TableHeader>
              <TableHeader>Service</TableHeader>
              <TableHeader>Present</TableHeader>
              <TableHeader>Late</TableHeader>
              <TableHeader>Absent</TableHeader>
              <TableHeader>Excused</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="attendance-empty">
                    <p className="attendance-empty__title">
                      No sessions recorded yet
                    </p>
                    <p className="attendance-empty__body">
                      Use the Mark Attendance tab to record your first session.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((session) => {
                const total =
                  session.totalPresent +
                  session.totalAbsent +
                  session.totalLate +
                  session.totalExcused;
                const rate = total
                  ? Math.round((session.totalPresent / total) * 100)
                  : 0;
                return (
                  <TableRow key={session.id}>
                    <TableCell>
                      {new Date(session.date).toLocaleDateString("en-UG", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Tag type="teal" size="sm">
                        {session.serviceType}
                      </Tag>
                    </TableCell>
                    <TableCell>
                      <span className="status-badge status-badge--present">
                        {session.totalPresent} ({rate}%)
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="status-badge status-badge--late">
                        {session.totalLate}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="status-badge status-badge--absent">
                        {session.totalAbsent}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="status-badge status-badge--excused">
                        {session.totalExcused}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                          kind="ghost"
                          size="sm"
                          hasIconOnly
                          renderIcon={View}
                          iconDescription="View session"
                          onClick={() => setViewId(session.id)}
                        />
                        <Button
                          kind="ghost"
                          size="sm"
                          hasIconOnly
                          renderIcon={TrashCan}
                          iconDescription="Delete session"
                          onClick={() => setDeleteId(session.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Modal
        open={!!viewId}
        modalHeading="Session Detail"
        passiveModal
        onRequestClose={() => setViewId(null)}
        size="lg"
      >
        {recordsLoading ? (
          <DataTableSkeleton columnCount={4} rowCount={3} />
        ) : (
          <Table size="sm" useZebraStyles>
            <TableHead>
              <TableRow>
                <TableHeader>Member</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Notes</TableHeader>
                <TableHeader>Marked By</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.memberName}</TableCell>
                  <TableCell>
                    <span className={`status-badge status-badge--${r.status}`}>
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell>{r.notes || "—"}</TableCell>
                  <TableCell>{r.markedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Modal>

      
      <Modal
        open={!!deleteId}
        danger
        modalHeading="Delete Session"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleDelete}
        onRequestClose={() => setDeleteId(null)}
        primaryButtonDisabled={deleteMutation.isPending}
      >
        <p>
          This will permanently remove the session and all its records. This
          cannot be undone.
        </p>
      </Modal>
    </>
  );
};
