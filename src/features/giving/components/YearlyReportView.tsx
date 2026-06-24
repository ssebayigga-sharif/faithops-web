import { Button, Column, Grid, Stack, Tile } from "@carbon/react";
import { DocumentPdf } from "@carbon/icons-react";
import type { YearlySummary } from "@/features/giving/types";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";
import { formatUGX, formatMonthLabel } from "../givingUtils";
import { colors } from "./givingStyles";

interface YearlyReportViewProps {
  summary: YearlySummary;
  onPrint: () => void;
}

export function YearlyReportView({ summary, onPrint }: YearlyReportViewProps) {
  return (
    <Stack gap={4}>
      <Tile
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Stack gap={4}>
          <Stack gap={1}>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 600,
                color: colors.text,
              }}
            >
              Yearly Report — {summary.year}
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: colors.textMuted }}>
              {summary.recordCount} record
              {summary.recordCount !== 1 ? "s" : ""} across 12 months
            </p>
          </Stack>

          <Grid fullWidth condensed>
            {GIVING_CATEGORIES.filter(
              (c) => (summary.byCategory[c.id] ?? 0) > 0,
            ).map((cat) => (
              <Column key={cat.id} sm={4} md={4} lg={6}>
                <Stack gap={1}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: colors.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {cat.label}
                  </span>
                  <strong
                    style={{
                      fontSize: "18px",
                      color: colors.text,
                    }}
                  >
                    {formatUGX(summary.byCategory[cat.id] ?? 0)}
                  </strong>
                </Stack>
              </Column>
            ))}
            <Column sm={4} md={8} lg={6}>
              <Stack gap={1}>
                <span
                  style={{
                    fontSize: "11px",
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Grand Total
                </span>
                <strong
                  style={{
                    fontSize: "20px",
                    color: colors.brand,
                  }}
                >
                  {formatUGX(summary.totalAmount)}
                </strong>
              </Stack>
            </Column>
          </Grid>

          <Stack gap={2}>
            <h4
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: colors.text,
              }}
            >
              Monthly Breakdown
            </h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ background: "var(--cds-layer-02, #f4f4f4)" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Month
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Records
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Tithe
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Offerings
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.monthlyBreakdown
                  .filter((m) => m.recordCount > 0)
                  .map((month) => (
                    <tr key={month.month}>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                        }}
                      >
                        {formatMonthLabel(month.month)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                        }}
                      >
                        {month.recordCount}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                        }}
                      >
                        {formatUGX(month.totalTithe)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                        }}
                      >
                        {formatUGX(month.totalOfferings)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {formatUGX(month.totalAmount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--cds-layer-02, #f4f4f4)" }}>
                  <td style={{ padding: "0.5rem", fontWeight: 600 }}>Total</td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {summary.recordCount}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {formatUGX(summary.totalTithe)}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {formatUGX(summary.totalOfferings)}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {formatUGX(summary.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Stack>
        </Stack>
      </Tile>

      <div>
        <Button kind="secondary" renderIcon={DocumentPdf} onClick={onPrint}>
          Print Yearly Report
        </Button>
      </div>
    </Stack>
  );
}
