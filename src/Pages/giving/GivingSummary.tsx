import { Column, Grid, ProgressBar, Stack, Tile } from "@carbon/react";
import type { GivingRecord } from "../../churchTypes/givingTypes";
import { GIVING_CATEGORIES } from "../../churchTypes/givingTypes";
import { buildMonthlySummary, formatUGX } from "./givingUtils";

interface GivingSummaryProps {
  records: GivingRecord[];
}

function getProgressStatus(percent: number): "active" | "finished" | "error" {
  if (percent >= 75) return "finished";
  if (percent < 25) return "error";
  return "active";
}

export function GivingSummary({ records }: GivingSummaryProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const summary = buildMonthlySummary(records, currentMonth);

  const monthLabel = new Date(currentMonth + "-01").toLocaleDateString(
    "en-UG",
    { month: "long", year: "numeric" },
  );

  // Find the dominant category for progress bar scaling
  const maxCategoryAmount = Math.max(1, ...Object.values(summary.byCategory));

  if (records.length === 0) {
    return (
      <Stack gap={3} className="giving-summary__empty">
        <p>No giving records yet for {monthLabel}.</p>
        <p className="giving-summary__empty-hint">
          Summaries will populate as records are added.
        </p>
      </Stack>
    );
  }

  return (
    <Stack gap={5} className="giving-summary">
      <Stack gap={1}>
        <h3 className="giving-summary__month">{monthLabel}</h3>
        <p className="giving-summary__record-count">
          {summary.recordCount} giving record
          {summary.recordCount !== 1 ? "s" : ""}
        </p>
      </Stack>

      {/* Summary metric cards */}
      <Grid fullWidth condensed>
        <Column sm={4} md={4} lg={5}>
          <Tile className="giving-summary__metric-tile giving-summary__metric-tile--tithe">
            <Stack gap={1}>
              <span className="giving-summary__metric-label">Total Tithe</span>
              <strong className="giving-summary__metric-value">
                {formatUGX(summary.totalTithe)}
              </strong>
              <span className="giving-summary__metric-sub">
                Returned to the storehouse
              </span>
            </Stack>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={5}>
          <Tile className="giving-summary__metric-tile giving-summary__metric-tile--offerings">
            <Stack gap={1}>
              <span className="giving-summary__metric-label">
                Total Offerings
              </span>
              <strong className="giving-summary__metric-value">
                {formatUGX(summary.totalOfferings)}
              </strong>
              <span className="giving-summary__metric-sub">
                Across all offering categories
              </span>
            </Stack>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={6}>
          <Tile className="giving-summary__metric-tile giving-summary__metric-tile--total">
            <Stack gap={1}>
              <span className="giving-summary__metric-label">Grand Total</span>
              <strong className="giving-summary__metric-value giving-summary__metric-value--grand">
                {formatUGX(summary.totalAmount)}
              </strong>
              <span className="giving-summary__metric-sub">
                {summary.recordCount} contributors this month
              </span>
            </Stack>
          </Tile>
        </Column>
      </Grid>

      {/* Category breakdown */}
      <Tile className="giving-summary__breakdown">
        <Stack gap={4}>
          <h4 className="giving-summary__breakdown-title">
            Breakdown by category
          </h4>
          <Stack gap={4}>
            {GIVING_CATEGORIES.filter(
              (c) => (summary.byCategory[c.id] ?? 0) > 0,
            ).map((category) => {
              const amount = summary.byCategory[category.id] ?? 0;
              const percent = Math.round((amount / maxCategoryAmount) * 100);
              return (
                <Stack key={category.id} gap={2}>
                  <Stack
                    orientation="horizontal"
                    gap={3}
                    className="giving-summary__breakdown-row"
                  >
                    <span>{category.label}</span>
                    <strong>{formatUGX(amount)}</strong>
                  </Stack>
                  <ProgressBar
                    hideLabel
                    label={category.label}
                    max={100}
                    size="small"
                    status={getProgressStatus(percent)}
                    value={percent}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Tile>

      {/* Scripture reminder */}
      <Tile className="giving-summary__scripture-tile">
        <Stack gap={1}>
          <p className="giving-summary__scripture-text">
            "Remember this: Whoever sows sparingly will also reap sparingly, and
            whoever sows generously will also reap generously."
          </p>
          <p className="giving-summary__scripture-ref">
            — 2 Corinthians 9:6 (NIV)
          </p>
        </Stack>
      </Tile>
    </Stack>
  );
}
