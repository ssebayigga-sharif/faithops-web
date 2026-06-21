import { InlineLoading } from "@carbon/react";
import type { Member } from "@/features/members/types";

interface MembersStatsCardsProps {
  members: Member[];
  isLoading: boolean;
}

export function MembersStatsCards({
  members,
  isLoading,
}: MembersStatsCardsProps) {
  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    baptized: members.filter((m) => m.baptized).length,
    newConverts: members.filter((m) => m.status === "New convert").length,
  };

  const cards = [
    {
      label: "Total Members",
      value: stats.total.toLocaleString(),
      meta: "Full church register count",
      accent: "#0f62fe",
    },
    {
      label: "Active Members",
      value: stats.active.toLocaleString(),
      meta: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total`,
      accent: "#198038",
    },
    {
      label: "Baptized",
      value: stats.baptized.toLocaleString(),
      meta: `${stats.total > 0 ? Math.round((stats.baptized / stats.total) * 100) : 0}% baptism rate`,
      accent: "#c6971a",
    },
    {
      label: "New Converts",
      value: stats.newConverts.toLocaleString(),
      meta: "Currently in discipleship",
      accent: "#6929c4",
    },
  ];

  return (
    <div className="metric-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className="metric-card"
          style={{ "--metric-accent": card.accent } as React.CSSProperties}
        >
          <p className="metric-card__label">{card.label}</p>
          {isLoading ? (
            <InlineLoading description="—" />
          ) : (
            <>
              <p className="metric-card__value">{card.value}</p>
              <p className="metric-card__meta">{card.meta}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MembersStatsCards;
