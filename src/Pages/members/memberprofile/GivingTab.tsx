import { Tag, Tile } from "@carbon/react";
import type { Member } from "@/churchTypes/memberTypes";
import { formatUGX } from "@/utils/memberUtils";

function GivingTab({ member }: { member: Member }) {
  const sorted = [...member.giving].sort(
    (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
  );

  const max = Math.max(...sorted.map((g) => g.amount), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Tile style={{ flex: 1, padding: "0.85rem" }}>
          <p style={{ fontSize: "11px", color: "#6f6f6f", marginBottom: 4 }}>Total Giving</p>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>
            {formatUGX(member._computed?.totalGiving ?? 0)}
          </p>
        </Tile>
        <Tile style={{ flex: 1, padding: "0.85rem" }}>
          <p style={{ fontSize: "11px", color: "#6f6f6f", marginBottom: 4 }}>Monthly Avg</p>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>
            {formatUGX(member._computed?.monthlyAvgGiving ?? 0)}
          </p>
        </Tile>
      </div>

      {sorted.map((g) => (
        <div
          key={`${g.month}-${g.type}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "0.75rem",
            borderBottom: "1px solid #f4f4f4",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{g.month}</span>
              <Tag type="blue" size="sm" style={{ marginLeft: 8 }}>
                {g.type}
              </Tag>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#198038" }}>
              {formatUGX(g.amount)}
            </span>
          </div>
          <div style={{ height: 5, background: "#f4f4f4", borderRadius: 3 }}>
            <div
              style={{
                height: "100%",
                width: `${Math.round((g.amount / max) * 100)}%`,
                background: "#0f2d52",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      ))}

      {sorted.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6f6f6f" }}>No giving records yet.</p>
      )}
    </div>
  );
}

export default GivingTab;