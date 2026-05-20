import { Tag } from "@carbon/react";
import { formatDate } from "@/utils/memberUtils";
import type { Member } from "@/churchTypes/memberTypes";

    function NotesTab({ member }: { member: Member }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {member.notes.map((n) => (
        <div
          key={n.id}
          style={{
            padding: "0.85rem",
            background: n.private ? "#fff8e1" : "#f4f4f4",
            borderRadius: "4px",
            borderLeft: `3px solid ${n.private ? "#c6971a" : "#e0e0e0"}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{n.author}</span>
              <span style={{ fontSize: "11px", color: "#6f6f6f", marginLeft: 6 }}>
                {n.authorRole}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {n.private && <Tag type="warm-gray" size="sm">Private</Tag>}
              <span style={{ fontSize: "11px", color: "#6f6f6f" }}>{formatDate(n.createdAt)}</span>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#161616", lineHeight: 1.5 }}>{n.content}</p>
        </div>
      ))}
      {member.notes.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6f6f6f" }}>No staff notes yet.</p>
      )}
    </div>
  );
}

export default NotesTab;
