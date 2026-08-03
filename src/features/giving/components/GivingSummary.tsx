import {
  Column,
  Grid,
  ProgressBar,
  Select,
  SelectItem,
  Stack,
  Tile,
} from "@carbon/react";
import type { GivingRecord, MonthlySummary } from "../types";
import { GIVING_CATEGORIES } from "../data/giving";
import {
  formatUGX,
  formatMonthLabel,
  buildMonthlySummary,
} from "../givingUtils";
import { SummaryCards } from "./SummaryCards";
import { colors } from "./givingStyles";

interface GivingSummaryProps {
  records: GivingRecord[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
}

function getProgressStatus(percent: number): "active" | "finished" | "error" {
  if (percent >= 75) return "finished";
  if (percent < 25) return "error";
  return "active";
}

export function GivingSummary({
  records,
  selectedMonth,
  onMonthChange,
  availableMonths,
}: GivingSummaryProps) {
  const summary: MonthlySummary = buildMonthlySummary(records, selectedMonth);

  const monthLabel = formatMonthLabel(selectedMonth);

  // Find the dominant category for progress bar scaling
  const maxCategoryAmount = Math.max(1, ...Object.values(summary.byCategory));

  if (records.length === 0) {
    return (
      <Stack gap={3} style={{ padding: "1rem 0" }}>
        <p>No giving records yet.</p>
        <p style={{ fontSize: "13px", color: colors.textMuted }}>
          Summaries will populate as records are added.
        </p>
      </Stack>
    );
  }

  return (
    <Stack gap={5}>
      {/* Month selector */}
      <Grid fullWidth condensed>
        <Column sm={4} md={4} lg={6}>
          <Select
            id="summary-month"
            labelText="Select month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            {availableMonths.length > 0 ? (
              availableMonths.map((m) => (
                <SelectItem key={m} value={m} text={formatMonthLabel(m)} />
              ))
            ) : (
              <SelectItem value={selectedMonth} text={monthLabel} />
            )}
          </Select>
        </Column>
        <Column sm={4} md={4} lg={6}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              height: "100%",
              paddingBottom: "0.5rem",
            }}
          >
            <Stack gap={1}>
              <span
                style={{
                  fontSize: "11px",
                  color: colors.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {monthLabel}
              </span>
              <strong style={{ fontSize: "16px", color: colors.text }}>
                {summary.recordCount} record
                {summary.recordCount !== 1 ? "s" : ""}
              </strong>
            </Stack>
          </div>
        </Column>
      </Grid>

      {/* Summary cards per category */}
      <SummaryCards
        totals={summary.byCategory}
        totalAmount={summary.totalAmount}
        recordCount={summary.recordCount}
      />

      {/* Category breakdown */}
      <Tile
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Stack gap={4}>
          <h4
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 600,
              color: colors.text,
            }}
          >
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "13px" }}>{category.label}</span>
                    <strong style={{ fontSize: "13px" }}>
                      {formatUGX(amount)}
                    </strong>
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
      <Tile
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderLeft: `3px solid ${colors.brand}`,
        }}
      >
        <Stack gap={1}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontStyle: "italic",
              color: colors.textSecondary,
            }}
          >
            "Remember this: Whoever sows sparingly will also reap sparingly, and
            whoever sows generously will also reap generously."
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: colors.textMuted,
            }}
          >
            — 2 Corinthians 9:6 (NIV)
          </p>
        </Stack>
      </Tile>
    </Stack>
  );
}
