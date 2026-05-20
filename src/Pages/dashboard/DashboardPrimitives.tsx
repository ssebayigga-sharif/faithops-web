import { type CSSProperties } from "react";
import {
  InlineLoading,
  ProgressBar,
  Stack,
  Tag,
  Tile,
  SkeletonText,
  SkeletonPlaceholder,
} from "@carbon/react";
import type {
  DashboardPanelProps,
  InsightItemProps,
  InsightStatus,
  MetricCardProps,
  OperationsRowProps,
  ProgressRowProps,
  DashboardTagType,
} from "@/churchTypes/dashboardTypes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getProgressStatus(percent: number): "active" | "finished" | "error" {
  if (percent < 40) return "error";
  if (percent >= 75) return "finished";
  return "active";
}

const INSIGHT_TAG_TYPE: Record<InsightStatus, DashboardTagType> = {
  critical: "red",
  warning: "magenta",
  healthy: "green",
  info: "blue",
};

// ─── MetricCard ───────────────────────────────────────────────────────────────

export function MetricCard({
  label,
  value,
  meta,
  accent,
  loading,
}: MetricCardProps) {
  return (
    <Tile
      className="metric-card"
      style={{ "--metric-accent": accent } as CSSProperties}
    >
      <p className="metric-card__label">{label}</p>
      {loading ? (
        <Stack gap={2}>
          <SkeletonText heading width="60%" />
          <SkeletonText width="80%" />
        </Stack>
      ) : (
        <Stack gap={2}>
          <p className="metric-card__value">{value}</p>
          <p className="metric-card__meta">{meta}</p>
        </Stack>
      )}
    </Tile>
  );
}

// ─── DashboardPanel ───────────────────────────────────────────────────────────
// Discriminated union enforces icon XOR tag at compile time

type PanelWithTag = DashboardPanelProps & { tagLabel: string; icon?: never };
type PanelWithIcon = DashboardPanelProps & {
  tagLabel?: never;
  icon?: DashboardPanelProps["icon"];
};
type PanelProps = PanelWithTag | PanelWithIcon;

export function DashboardPanel({
  title,
  description,
  icon: Icon,
  tagLabel,
  tagType = "blue",
  children,
  loading,
}: PanelProps & { loading?: boolean }) {
  return (
    <Tile className="dashboard-section">
      <Stack
        as="header"
        className="dashboard-section__header"
        orientation="horizontal"
        gap={5}
      >
        <Stack gap={2}>
          <h2>{title}</h2>
          <p>{description}</p>
        </Stack>
        {tagLabel ? (
          <Tag type={tagType} size="sm">
            {tagLabel}
          </Tag>
        ) : (
          Icon && <Icon size={20} />
        )}
      </Stack>

      <Stack className="dashboard-section__body" gap={5}>
        {loading ? <PanelSkeleton /> : children}
      </Stack>
    </Tile>
  );
}

function PanelSkeleton() {
  return (
    <Stack gap={4}>
      <SkeletonText paragraph lineCount={2} />
      <SkeletonPlaceholder style={{ width: "100%", height: "6rem" }} />
    </Stack>
  );
}

// ─── InsightItem ──────────────────────────────────────────────────────────────

export function InsightItem({
  icon: Icon,
  title,
  description,
  status,
  actionLabel,
}: InsightItemProps) {
  return (
    <Stack
      as="article"
      className={`insight-item insight-item--${status}`}
      orientation="horizontal"
      gap={5}
    >
      <span className="insight-item__icon">
        <Icon size={18} />
      </span>
      <Stack gap={1}>
        <h3>{title}</h3>
        <p>{description}</p>
      </Stack>
      {actionLabel && (
        <Tag type={INSIGHT_TAG_TYPE[status]} size="sm">
          {actionLabel}
        </Tag>
      )}
    </Stack>
  );
}

// ─── ProgressRow ─────────────────────────────────────────────────────────────

export function ProgressRow({ label, value, percent }: ProgressRowProps) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <Stack className="bar-list__row" gap={3}>
      <Stack className="bar-list__meta" orientation="horizontal" gap={5}>
        <span>{label}</span>
        <strong>{value}</strong>
      </Stack>
      <ProgressBar
        hideLabel
        label={label}
        max={100}
        size="small"
        status={getProgressStatus(safePercent)}
        value={safePercent}
      />
    </Stack>
  );
}

// ─── OperationsRow ────────────────────────────────────────────────────────────

export function OperationsRow({
  title,
  description,
  tag,
  tagType,
}: OperationsRowProps) {
  return (
    <Stack as="article" className="ops-row" orientation="horizontal" gap={5}>
      <Stack gap={1}>
        <h3>{title}</h3>
        <p>{description}</p>
      </Stack>
      <Tag type={tagType} size="sm">
        {tag}
      </Tag>
    </Stack>
  );
}
