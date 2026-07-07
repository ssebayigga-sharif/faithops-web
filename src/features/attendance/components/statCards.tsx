import React from "react";
import {
  CheckmarkFilled,
  Time,
  ErrorFilled,
  Misuse,
} from "@carbon/icons-react";
import type { AttendanceSession } from "@/features/attendance/types";

interface Props {
  session: AttendanceSession | null;
}

const STATUS_CONFIG = [
  {
    key: "present" as const,
    label: "Present",
    icon: CheckmarkFilled,
    modifier: "present",
  },

  {
    key: "absent" as const,
    label: "Absent",
    icon: ErrorFilled,
    modifier: "absent",
  },
] as const;

export const StatCards: React.FC<Props> = ({ session }) => {
  const total = session
    ? session.totalPresent +
      session.totalAbsent +
      session.totalLate +
      session.totalExcused
    : 0;

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const getTotalValue = (key: string): number => {
    if (!session) return 0;
    const k = `total${key.charAt(0).toUpperCase() + key.slice(1)}`;
    const val = (session as any)[k];
    return typeof val === "number" ? val : 0;
  };

  return (
    <div className="stat-cards">
      {STATUS_CONFIG.map(({ key, label, icon: Icon, modifier }) => {
        const value = getTotalValue(key);
        return (
          <div
            key={key}
            className={`stat-cards__card stat-cards__card--${modifier}`}
          >
            <div className="stat-cards__header">
              <Icon size={20} />
              <span className="stat-cards__label">{label}</span>
            </div>
            <span className="stat-cards__value">{value ?? "—"}</span>
            {session && total > 0 && (
              <span className="stat-cards__sub">{pct(value)}% of total</span>
            )}
          </div>
        );
      })}
      {/* Visitors card */}
      <div className="stat-cards__card stat-cards__card--visitors">
        <div className="stat-cards__header">
          <span className="stat-cards__label">Visitors</span>
        </div>
        <span className="stat-cards__value">{session?.totalVisitors ?? 0}</span>
        {session && (
          <span className="stat-cards__sub">
            {session.totalVisitors > 0
              ? `${session.totalVisitors} guest(s)`
              : ""}
          </span>
        )}
      </div>
    </div>
  );
};
