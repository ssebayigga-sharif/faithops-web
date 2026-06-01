import {
  Calendar,
  CheckmarkFilled,
  Edit,
  GroupPresentation,
  Money,
  User,
  ChevronRight,
  Bookmark,
} from "@carbon/icons-react";
import type { Member } from "@/features/members/types";
import { formatDate } from "@/features/members/utils/memberUtils";

function TimelineTab({ member }: { member: Member }) {
  const icons: Record<string, React.ReactNode> = {
    joined: <User size={14} />,
    baptized: <CheckmarkFilled size={14} />,
    ministry: <GroupPresentation size={14} />,
    followup: <Bookmark size={14} />,
    note: <Edit size={14} />,
    attendance: <Calendar size={14} />,
    giving: <Money size={14} />,
  };

  const sorted = [...member.timeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          bottom: 0,
          width: 2,
          background: "#e0e0e0",
        }}
      />
      {sorted.map((e) => (
        <div key={e.id} style={{ position: "relative", marginBottom: "1rem" }}>
          <div
            style={{
              position: "absolute",
              left: -26,
              top: 4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#0f2d52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {icons[e.type] ?? <ChevronRight size={12} />}
          </div>
          <div style={{ padding: "0.65rem 0.85rem", background: "#f4f4f4", borderRadius: "4px" }}>
            <p style={{ fontSize: "13px", color: "#161616", marginBottom: 2 }}>{e.description}</p>
            <p style={{ fontSize: "11px", color: "#6f6f6f" }}>{formatDate(e.date)}</p>
          </div>
        </div>
      ))}
      {sorted.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6f6f6f" }}>No timeline events yet.</p>
      )}
    </div>
  );
}

export default TimelineTab;
