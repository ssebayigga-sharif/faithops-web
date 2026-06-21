import type { CSSProperties } from "react";
import { colors, labelCaps, statCardStyle } from "../components/givingStyles";

interface GivingStatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent: string;
}

export function GivingStatCard({
  label,
  value,
  sub,
  accent,
}: GivingStatCardProps) {
  return (
    <div style={statCardStyle(accent)}>
      <p style={{ ...labelCaps, marginBottom: 4 }}>{label}</p>
      <p
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: colors.text,
          margin: 0,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: colors.textMuted,
            margin: "4px 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function StepNumber({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  const done = index < currentIndex;
  const active = index === currentIndex;
  const style: CSSProperties = {
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 500,
    flexShrink: 0,
    background: done
      ? colors.success
      : active
        ? colors.interactive
        : "var(--cds-layer-02, #f4f4f4)",
    border: `1px solid ${done ? colors.success : active ? colors.interactive : colors.border}`,
    color: done || active ? "#ffffff" : colors.textMuted,
  };
  return <span style={style}>{index + 1}</span>;
}
