import { Button, Column, Grid, Stack, Tile } from "@carbon/react";
import { Download } from "@carbon/icons-react";
import type { GivingReport } from "@/features/giving/types";
import { formatUGX, formatShortDate } from "../givingUtils";
import { colors } from "./givingStyles";

interface CustomReportViewProps {
  report: GivingReport;
  onPrint: () => void;
}

export function CustomReportView({ report, onPrint }: CustomReportViewProps) {
  if (report.records.length === 0) {
    return (
      <Tile
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
        }}
      >
        <p style={{ fontSize: "13px", color: colors.textMuted }}>
          No records found in the selected date range.
        </p>
      </Tile>
    );
  }

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
              Custom Period Report
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: colors.textMuted }}>
              {formatShortDate(report.fromDate)} —{" "}
              {formatShortDate(report.toDate)} · {report.totalRecords} record
              {report.totalRecords !== 1 ? "s" : ""}
            </p>
          </Stack>

          <Grid fullWidth condensed>
            {report.categoryTotals.map((cat) => (
              <Column key={cat.categoryId} sm={4} md={4} lg={6}>
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
                    {formatUGX(cat.amount)}
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: colors.textMuted,
                    }}
                  >
                    {cat.percentage}% of total
                  </span>
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
                  {formatUGX(report.totalAmount)}
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
              Individual Records
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
                    Receipt
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Member
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.records.map((r) => (
                  <tr key={r.id}>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {r.receiptNumber}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {r.memberName}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {formatShortDate(r.date)}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: `1px solid ${colors.border}`,
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {formatUGX(r.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--cds-layer-02, #f4f4f4)" }}>
                  <td
                    colSpan={3}
                    style={{ padding: "0.5rem", fontWeight: 600 }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {formatUGX(report.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Stack>
        </Stack>
      </Tile>

      <div>
        <Button kind="secondary" renderIcon={Download} onClick={onPrint}>
          Print Report
        </Button>
      </div>
    </Stack>
  );
}
