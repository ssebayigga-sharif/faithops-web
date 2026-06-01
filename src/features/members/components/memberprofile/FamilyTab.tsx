import type { Member } from "@/features/members/types";
import { Tag } from "@carbon/react";

function FamilyTab({ member }: { member: Member }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {member.family.map((f, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem",
            background: "#f4f4f4",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#0f2d52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {f.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "13px", fontWeight: 500 }}>{f.name}</p>
            <p style={{ fontSize: "11.5px", color: "#6f6f6f" }}>
              {f.relation} {f.phone ? `· ${f.phone}` : ""}
            </p>
          </div>
          {f.isEmergencyContact && (
            <Tag type="red" size="sm">Emergency Contact</Tag>
          )}
          {f.memberId && (
            <Tag type="green" size="sm">Registered</Tag>
          )}
        </div>
      ))}
      {member.family.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6f6f6f" }}>No family links recorded.</p>
      )}
    </div>
  );
}

export default FamilyTab;   
