import { Button } from "@carbon/react";
import { Police } from "@carbon/icons-react";
import type { VisitorRowPayload } from "../types";

interface VisitorListProps {
  visitors: VisitorRowPayload[];
  onRemove: (index: number) => void;
}

export function VisitorList({ visitors, onRemove }: VisitorListProps) {
  if (visitors.length === 0) return null;

  return (
    <div
      className="attendancepage__visitorlist"
      style={{ marginTop: "0.75rem" }}
    >
      <p
        className="attendancepage__visitorlistlabel"
        style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.5rem" }}
      >
        Visitors added ({visitors.length}):
      </p>
      {visitors.map((v, i) => (
        <div
          key={i}
          className="attendancepage__visitoritem"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.35rem 0",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>
            {v.name} — {v.phone}
          </span>
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={Police}
            iconDescription="Remove"
            onClick={() => onRemove(i)}
          />
        </div>
      ))}
    </div>
  );
}

export default VisitorList;
