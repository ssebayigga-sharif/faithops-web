import { Tile, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody } from "@carbon/react";
import type { Member } from "@/churchTypes/memberTypes";
import { formatUGX, formatDate } from "@/utils/memberUtils";

function OverviewTab({ member }: { member: Member }) {
  const c = member._computed;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
        {[
          {
            label: "Attendance",
            value: `${c?.attendanceRate ?? 0}%`,
            sub: `${c?.consecutiveMisses ?? 0} missed in a row`,
          },
          {
            label: "Total Giving",
            value: formatUGX(c?.totalGiving ?? 0),
            sub: `Avg ${formatUGX(c?.monthlyAvgGiving ?? 0)}/mo`,
          },
          {
            label: "Last Attended",
            value: c?.lastAttended ? formatDate(c.lastAttended) : "Never",
            sub: member.joinedAt ? `Joined ${formatDate(member.joinedAt)}` : "",
          },
        ].map((s) => (
          <Tile key={s.label} style={{ padding: "0.85rem" }}>
            <p style={{ fontSize: "11px", color: "#6f6f6f", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {s.label}
            </p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#161616", marginBottom: "2px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "11px", color: "#6f6f6f" }}>{s.sub}</p>
          </Tile>
        ))}
      </div>

      {/* Personal details */}
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Field</StructuredListCell>
            <StructuredListCell head>Value</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {[
            { label: "Full Name", value: c?.fullName ?? `${member.firstName} ${member.lastName}` },
            { label: "Gender", value: member.gender },
            { label: "Age", value: `${member.age} years` },
            { label: "Marital Status", value: member.maritalStatus },
            { label: "Phone", value: member.phone },
            { label: "Email", value: member.email || "—" },
            { label: "Cell Group", value: member.cellGroup },
            { label: "Baptized", value: member.baptized ? "Yes ✓" : "No" },
          ].map((row) => (
            <StructuredListRow key={row.label}>
              <StructuredListCell style={{ color: "#6f6f6f", fontSize: "13px" }}>
                {row.label}
              </StructuredListCell>
              <StructuredListCell style={{ fontSize: "13px", fontWeight: 500 }}>
                {row.value}
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </div>
  );
}

export default OverviewTab;