import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Tag,
} from "@carbon/react";
import type { VisitorRecord } from "@/features/attendance/types";

interface VisitorsTableProps {
  visitors: VisitorRecord[];
  onUpdateFollowUp: (visitor: VisitorRecord) => void;
}

export function VisitorsTable({
  visitors,
  onUpdateFollowUp,
}: VisitorsTableProps) {
  return (
    <TableContainer
      title="Visitor Records"
      description={`${visitors.length} total visitors recorded`}
    >
      <Table size="lg" useZebraStyles>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Phone</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Service</TableHeader>
            <TableHeader>Follow-Up</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {visitors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="attendance-empty">
                  <p className="attendance-empty__title">
                    No visitors recorded
                  </p>
                  <p className="attendance-empty__body">
                    Visitors are automatically recorded when you add them during
                    attendance marking.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            visitors.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.name}</TableCell>
                <TableCell>{v.phone}</TableCell>
                <TableCell>{v.email || "—"}</TableCell>
                <TableCell>
                  {new Date(v.date).toLocaleDateString("en-UG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Tag type="teal" size="sm">
                    {v.serviceType}
                  </Tag>
                </TableCell>
                <TableCell>
                  <Tag
                    type={
                      v.followUpStatus === "pending"
                        ? "red"
                        : v.followUpStatus === "contacted"
                          ? "blue"
                          : v.followUpStatus === "converted"
                            ? "green"
                            : "gray"
                    }
                    size="sm"
                  >
                    {v.followUpStatus}
                  </Tag>
                </TableCell>
                <TableCell>
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={() => onUpdateFollowUp(v)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
