import { Button, Column, Grid, Stack, Tile } from "@carbon/react";
import { Download } from "@carbon/icons-react";
import type { MonthlySummary } from "@/features/giving/types";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";
import { formatUGX } from "../givingUtils";
import { colors } from "./givingStyles";

interface MonthlyReportViewProps {
  title: string;
  totals: MonthlySummary;
  onPrint: () => void;
}

export function MonthlyReportView({
  title,
  totals,
  onPrint,
}: MonthlyReportViewProps) {
  return (
    <Stack gap={4}>
      <div>
        <Tile
          style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Stack gap={3}>
            <Stack
              orientation="horizontal"
              gap={3}
              style={{ justifyContent: "space-between" }}
            >
              <Stack gap={1}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: colors.textMuted,
                  }}
                >
                  Kabulengwa SDA Church · {totals.recordCount} record
                  {totals.recordCount !== 1 ? "s" : ""}
                </p>
              </Stack>
            </Stack>

            <Grid fullWidth condensed>
              {GIVING_CATEGORIES.filter(
                (c) => (totals.byCategory[c.id] ?? 0) > 0,
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
                      {formatUGX(totals.byCategory[cat.id] ?? 0)}
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
                    {formatUGX(totals.totalAmount)}
                  </strong>
                </Stack>
              </Column>
            </Grid>
          </Stack>
        </Tile>
      </div>

      <div>
        <Button kind="secondary" renderIcon={Download} onClick={onPrint}>
          Print Report
        </Button>
      </div>
    </Stack>
  );
}
