import type { Member } from "@/features/members/types";
import { formatDate } from "@/features/members/utils/memberUtils";
import { Tag } from "@carbon/react";

function MinistriesTab({ member }: { member: Member }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {member.ministries.map((m, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1rem",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
        >
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600 }}>{m.ministry}</p>
            <p style={{ fontSize: "12px", color: "#6f6f6f" }}>
              {m.role} · Joined {formatDate(m.joinedAt)}
            </p>
          </div>
          <Tag type={m.active ? "green" : "gray"} size="md">
            {m.active ? "Active" : "Inactive"}
          </Tag>
        </div>
      ))}
      {member.ministries.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6f6f6f" }}>Not assigned to any ministry yet.</p>
      )}
    </div>
  );
}

export default MinistriesTab;
