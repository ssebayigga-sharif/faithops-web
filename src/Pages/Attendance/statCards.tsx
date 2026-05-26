import React from "react";
import type { AttendanceSession } from "./attendance";

interface Props {
  session: AttendanceSession | null;
}

export const StatCards: React.FC<Props> = ({ session }) => {
  const total = session
    ? session.totalPresent +
      session.totalAbsent +
      session.totalLate +
      session.totalExcused
    : 0;

  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const cards = [
    {
      mod: "present",
      label: "Present",
      value: session?.totalPresent ?? "—",
      sub: session
        ? `${pct(session.totalPresent)}% attendance`
        : "No session selected",
    },
    {
      mod: "late",
      label: "Late",
      value: session?.totalLate ?? "—",
      sub: session ? `${pct(session.totalLate)}% of total` : "",
    },
    {
      mod: "absent",
      label: "Absent",
      value: session?.totalAbsent ?? "—",
      sub: session ? `${pct(session.totalAbsent)}% of total` : "",
    },
    {
      mod: "excused",
      label: "Excused",
      value: session?.totalExcused ?? "—",
      sub: session ? `${pct(session.totalExcused)}% of total` : "",
    },
  ];

  return (
    <div className="stat-cards">
      {cards.map((c) => (
        <div
          key={c.mod}
          className={`stat-cards__card stat-cards__card--${c.mod}`}
        >
          <span className="stat-cards__label">{c.label}</span>
          <span className="stat-cards__value">{c.value}</span>
          {c.sub && <span className="stat-cards__sub">{c.sub}</span>}
        </div>
      ))}
    </div>
  );
};
