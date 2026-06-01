import { Tag } from "@carbon/react";
import type { Member } from "@/features/members/types";
import { formatDate } from "@/features/members/utils/memberUtils";

    function FollowUpTab({ member }: { member: Member }) {
  const statusColor = {
    pending: "gray",
    done: "green",
    overdue: "red",
  } as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {member.followUps.map((f) => (
        <div
          key={f.id}
          style={{
            padding: "0.85rem",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            borderLeft: `4px solid ${f.status === "done" ? "#24a148" : f.status === "overdue" ? "#da1e28" : "#6f6f6f"}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, flex: 1, marginRight: 8 }}>{f.task}</p>
            <Tag type={statusColor[f.status]} size="sm">{f.status}</Tag>
          </div>
          <p style={{ fontSize: "12px", color: "#6f6f6f", marginTop: 4 }}>
            Assigned to: {f.assignedTo} · Due: {formatDate(f.dueDate)}
          </p>
          {f.completedAt && (
            <p style={{ fontSize: "11px", color: "#198038", marginTop: 2 }}>
              Completed: {formatDate(f.completedAt)}
            </p>
          )}
        </div>
      ))}
      {member.followUps.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6f6f6f" }}>No follow-up tasks assigned.</p>
      )}
    </div>
  );
}

export default FollowUpTab; 
