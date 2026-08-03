import {
  Button,
  Modal,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
} from "@carbon/react";
import type { FollowUpCandidate } from "../services/sync.services";

interface FollowUpModalProps {
  open: boolean;
  candidates: FollowUpCandidate[];
  isCreating: boolean;
  onClose: () => void;
  onCreateTask: (candidate: FollowUpCandidate) => void;
}

export function FollowUpModal({
  open,
  candidates,
  isCreating,
  onClose,
  onCreateTask,
}: FollowUpModalProps) {
  return (
    <Modal
      open={open}
      modalHeading="Members Needing Follow-Up"
      primaryButtonText="Close"
      onRequestClose={onClose}
      onRequestSubmit={onClose}
      size="lg"
    >
      {candidates.length === 0 ? (
        <p>No members currently need follow-up for missed attendance.</p>
      ) : (
        <Table size="sm" useZebraStyles>
          <TableHead>
            <TableRow>
              <TableHeader>Member</TableHeader>
              <TableHeader>Consecutive Misses</TableHeader>
              <TableHeader>Last Attended</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((c) => (
              <TableRow key={c.memberId}>
                <TableCell>{c.memberName}</TableCell>
                <TableCell>
                  <Tag type="red" size="sm">
                    {c.consecutiveMisses}
                  </Tag>
                </TableCell>
                <TableCell>
                  {c.lastAttended
                    ? new Date(c.lastAttended).toLocaleDateString("en-UG")
                    : "Never"}
                </TableCell>
                <TableCell>
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={() => onCreateTask(c)}
                    disabled={isCreating}
                  >
                    Create Task
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Modal>
  );
}
