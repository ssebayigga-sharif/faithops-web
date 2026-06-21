import { Column, Grid, Stack, Tile } from "@carbon/react";
import type { GivingCategoryId } from "@/features/giving/types";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";
import { formatUGX } from "../givingUtils";
import { colors } from "./givingStyles";

const CATEGORY_ACCENTS: Record<GivingCategoryId, string> = {
  tithe: "#0f62fe",
  offering: "#198038",
  building_fund: "#f1c21b",
  mission_fund: "#8a3ffc",
};

const CATEGORY_ICONS: Record<GivingCategoryId, string> = {
  tithe: "10%",
  offering: "🎁",
  building_fund: "🏗️",
  mission_fund: "🌍",
};

interface SummaryCardsProps {
  totals: Record<GivingCategoryId, number>;
  totalAmount: number;
  recordCount: number;
}

export function SummaryCards({
  totals,
  totalAmount,
  recordCount,
}: SummaryCardsProps) {
  return (
    <Grid fullWidth condensed>
      {GIVING_CATEGORIES.map((category) => {
        const amount = totals[category.id] ?? 0;
        const accent = CATEGORY_ACCENTS[category.id];
        return (
          <Column key={category.id} sm={4} md={4} lg={6}>
            <Tile
              style={{
                background: colors.white,
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${accent}`,
                padding: "0.85rem 1.1rem",
                height: "100%",
              }}
            >
              <Stack gap={1}>
                <Stack
                  orientation="horizontal"
                  gap={2}
                  style={{ alignItems: "center" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: colors.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {category.label}
                  </span>
                  {category.isTithe && (
                    <span
                      style={{
                        background: "#0f62fe",
                        color: "#fff",
                        fontSize: "10px",
                        padding: "1px 6px",
                        borderRadius: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {CATEGORY_ICONS[category.id]}
                    </span>
                  )}
                </Stack>
                <strong
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: colors.text,
                    margin: 0,
                  }}
                >
                  {formatUGX(amount)}
                </strong>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "12px",
                    color: colors.textMuted,
                  }}
                >
                  {category.subtitle}
                </p>
              </Stack>
            </Tile>
          </Column>
        );
      })}

      {/* Grand total card */}
      <Column sm={4} md={8} lg={6}>
        <Tile
          style={{
            background: colors.brand,
            border: "none",
            padding: "0.85rem 1.1rem",
            height: "100%",
          }}
        >
          <Stack gap={1}>
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Grand Total
            </span>
            <strong
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
              }}
            >
              {formatUGX(totalAmount)}
            </strong>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "12px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {recordCount} record{recordCount !== 1 ? "s" : ""}
            </p>
          </Stack>
        </Tile>
      </Column>
    </Grid>
  );
}
