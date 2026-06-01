import type { Member } from "@/features/members/types";
import { ProgressBar } from "@carbon/react";
import { formatDate } from "@/features/members/utils/memberUtils";


function AttendanceDot({ present }: { present: boolean }) {
  return (
    <span
      title={present ? "Present" : "Absent"}
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: present ? "#24a148" : "#da1e28",
        flexShrink: 0,
      }}
    />
  );
}

    function AttendanceTab({ member }: { member: Member }) {
  const sorted = [...member.attendance]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const rate = member._computed?.attendanceRate ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ padding: "1rem", background: "#f4f4f4", borderRadius: "4px" }}>
        <p style={{ fontSize: "12px", color: "#6f6f6f", marginBottom: "0.5rem" }}>
          Overall Attendance Rate
        </p>
        <ProgressBar
          label={`${rate}%`}
          value={rate}
          max={100}
          status={rate >= 75 ? "finished" : rate >= 40 ? "active" : "error"}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {sorted.map((rec) => (
          <div
            key={rec.date}
            title={`${formatDate(rec.date)} — ${rec.serviceType} — ${rec.present ? "Present" : "Absent"}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px 10px",
              background: rec.present ? "#defbe6" : "#fff1f1",
              borderRadius: "4px",
              minWidth: 64,
            }}
          >
            <AttendanceDot present={rec.present} />
            <span style={{ fontSize: "10px", color: "#525252" }}>
              {formatDate(rec.date)}
            </span>
            <span style={{ fontSize: "9px", color: "#6f6f6f", textTransform: "uppercase" }}>
              {rec.serviceType}
            </span>
          </div>
        ))}
        {sorted.length === 0 && (
          <p style={{ fontSize: "13px", color: "#6f6f6f" }}>No attendance records yet.</p>
        )}
      </div>
    </div>
  );
}


export default AttendanceTab;
