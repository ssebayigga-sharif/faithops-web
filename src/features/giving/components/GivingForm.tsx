import {
  Button,
  Column,
  Grid,
  InlineNotification,
  NumberInput,
  Select,
  SelectItem,
  Stack,
  TextInput,
  Tile,
  Tooltip,
} from "@carbon/react";
import { Calculator, Information } from "@carbon/icons-react";
import type {
  GivingCategoryId,
  GivingFormState,
  GivingFrequency,
  GivingMethod,
} from "@/features/giving/types";
import {
  GIVING_CATEGORIES,
  GIVING_FREQUENCIES,
  GIVING_METHODS,
} from "@/features/giving/data/giving";
import { formatUGX, getRecentSabbaths } from "../givingUtils";
import {
  colors,
  flexBetween,
  flexRowWrap,
  labelCaps,
  scriptureTrigger,
  sectionDesc,
  sectionTitle,
  tileSection,
} from "../components/givingStyles";

interface GivingFormProps {
  form: GivingFormState;
  totalAmount: number;
  totalTithe: number;
  totalOfferings: number;
  isValid: boolean;
  onSetField: <K extends keyof GivingFormState>(
    key: K,
    value: GivingFormState[K],
  ) => void;
  onSetEntryAmount: (categoryId: GivingCategoryId, raw: string) => void;
  onApplySuggestedTithe: () => void;
  onReview: () => void;
}

const RECENT_SABBATHS = getRecentSabbaths(8).map((date) => ({
  value: date,
  label: new Date(date).toLocaleDateString("en-UG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
}));

export function GivingForm({
  form,
  totalAmount,
  totalTithe,
  totalOfferings,
  isValid,
  onSetField,
  onSetEntryAmount,
  onApplySuggestedTithe,
  onReview,
}: GivingFormProps) {
  const titheCategory = GIVING_CATEGORIES.find((c) => c.isTithe)!;
  const offeringCategories = GIVING_CATEGORIES.filter((c) => !c.isTithe);

  return (
    <Stack gap={6}>
      <Tile style={tileSection}>
        <Stack gap={4}>
          <h3 style={sectionTitle}>Member information</h3>
          <Grid fullWidth>
            <Column sm={4} md={4} lg={8}>
              <TextInput
                id="memberName"
                labelText="Member name"
                placeholder="Full name"
                value={form.memberName}
                onChange={(e) => onSetField("memberName", e.target.value)}
              />
            </Column>
            <Column sm={4} md={4} lg={8}>
              <Select
                id="sabbathDate"
                labelText="Sabbath date (attributed to)"
                value={form.sabbathDate}
                onChange={(e) => onSetField("sabbathDate", e.target.value)}
              >
                {RECENT_SABBATHS.map((s) => (
                  <SelectItem key={s.value} value={s.value} text={s.label} />
                ))}
              </Select>
            </Column>
            <Column sm={4} md={4} lg={8}>
              <Select
                id="method"
                labelText="Giving method"
                value={form.method}
                onChange={(e) =>
                  onSetField("method", e.target.value as GivingMethod)
                }
              >
                {GIVING_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value} text={m.label} />
                ))}
              </Select>
            </Column>
            <Column sm={4} md={4} lg={8}>
              <Select
                id="frequency"
                labelText="Frequency"
                value={form.frequency}
                onChange={(e) =>
                  onSetField("frequency", e.target.value as GivingFrequency)
                }
              >
                {GIVING_FREQUENCIES.map((f) => (
                  <SelectItem key={f.value} value={f.value} text={f.label} />
                ))}
              </Select>
            </Column>
            <Column sm={4} md={4} lg={8}>
              <TextInput
                id="recordedBy"
                labelText="Recorded by (treasurer / elder)"
                placeholder="Name of recorder"
                value={form.recordedBy}
                onChange={(e) => onSetField("recordedBy", e.target.value)}
              />
            </Column>
          </Grid>
        </Stack>
      </Tile>

      <Tile
        style={{
          ...tileSection,
          borderLeft: `3px solid ${colors.interactive}`,
        }}
      >
        <Stack gap={4}>
          <Stack orientation="horizontal" gap={3}>
            <p style={sectionDesc}>{titheCategory.subtitle}</p>
            <Tooltip
              label={`"${titheCategory.scripture}" — ${titheCategory.scriptureRef}`}
              align="bottom"
            >
              <button
                type="button"
                style={scriptureTrigger}
                aria-label="Scripture reference"
              >
                <Information size={16} />
              </button>
            </Tooltip>
          </Stack>

          <Tile
            style={{
              background: "#f4f4f4",
              border: `1px solid ${colors.border}`,
            }}
          >
            <Stack gap={3}>
              <Stack orientation="horizontal" gap={2}>
                <Calculator size={16} />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>
                  Tithe calculator
                </span>
              </Stack>
              <Grid fullWidth condensed>
                <Column sm={4} md={4} lg={8}>
                  <NumberInput
                    id="income"
                    label="Your income this period (UGX)"
                    placeholder="e.g. 500000"
                    value={form.income}
                    onChange={(_, { value }) =>
                      onSetField("income", String(value))
                    }
                    min={0}
                    hideSteppers
                  />
                </Column>
                <Column sm={4} md={4} lg={8}>
                  <div
                    style={{
                      ...flexBetween,
                      alignItems: "flex-end",
                      height: "100%",
                    }}
                  >
                    <Stack gap={1}>
                      <span style={labelCaps}>10% suggested tithe</span>
                      <strong style={{ fontSize: "18px", color: colors.text }}>
                        {form.income
                          ? formatUGX(
                              Math.round((parseFloat(form.income) || 0) * 0.1),
                            )
                          : "—"}
                      </strong>
                    </Stack>
                    <Button
                      kind="ghost"
                      size="sm"
                      onClick={onApplySuggestedTithe}
                      disabled={!form.income || parseFloat(form.income) <= 0}
                    >
                      Apply
                    </Button>
                  </div>
                </Column>
              </Grid>
            </Stack>
          </Tile>

          <Grid fullWidth>
            <Column sm={4} md={4} lg={8}>
              <NumberInput
                id="tithe-amount"
                label="Tithe amount (UGX)"
                placeholder="0"
                value={form.entries["tithe"] ?? ""}
                onChange={(_, { value }) =>
                  onSetEntryAmount("tithe", String(value))
                }
                min={0}
                hideSteppers
              />
            </Column>
          </Grid>
        </Stack>
      </Tile>

      <Tile style={tileSection}>
        <Stack gap={5}>
          <Stack gap={1}>
            <h3 style={sectionTitle}>Offerings</h3>
            <p style={sectionDesc}>
              &ldquo;Each of you should give what you have decided in your heart
              to give, not reluctantly or under compulsion, for God loves a
              cheerful giver.&rdquo; — 2 Corinthians 9:7
            </p>
          </Stack>

          <Grid fullWidth withRowGap>
            {offeringCategories.map((category) => (
              <Column key={category.id} sm={4} md={4} lg={8}>
                <Stack gap={2}>
                  <Stack orientation="horizontal" gap={2}>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {category.label}
                    </span>
                    <Tooltip
                      label={`${category.subtitle} · ${category.scriptureRef}`}
                      align="bottom"
                    >
                      <button
                        type="button"
                        style={scriptureTrigger}
                        aria-label={`Scripture for ${category.label}`}
                      >
                        <Information size={14} />
                      </button>
                    </Tooltip>
                  </Stack>
                  <NumberInput
                    id={`offering-${category.id}`}
                    label=""
                    hideLabel
                    placeholder="0"
                    value={form.entries[category.id] ?? ""}
                    onChange={(_, { value }) =>
                      onSetEntryAmount(category.id, String(value))
                    }
                    min={0}
                    hideSteppers
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: colors.textMuted,
                    }}
                  >
                    {category.subtitle}
                  </p>
                </Stack>
              </Column>
            ))}
          </Grid>
        </Stack>
      </Tile>

      <Tile style={tileSection}>
        <TextInput
          id="notes"
          labelText="Notes (optional)"
          placeholder="Any additional remarks..."
          value={form.notes}
          onChange={(e) => onSetField("notes", e.target.value)}
        />
      </Tile>

      {totalAmount > 0 && (
        <Tile
          style={{
            ...tileSection,
            borderLeft: `4px solid ${colors.brand}`,
          }}
        >
          <div style={flexRowWrap}>
            <Stack gap={1} style={{ flex: "1 1 120px" }}>
              <span style={labelCaps}>Tithe</span>
              <strong>{formatUGX(totalTithe)}</strong>
            </Stack>
            <Stack gap={1} style={{ flex: "1 1 120px" }}>
              <span style={labelCaps}>Offerings</span>
              <strong>{formatUGX(totalOfferings)}</strong>
            </Stack>
            <Stack gap={1} style={{ flex: "1 1 120px" }}>
              <span style={labelCaps}>Total</span>
              <strong style={{ fontSize: "22px", color: colors.text }}>
                {formatUGX(totalAmount)}
              </strong>
            </Stack>
          </div>
        </Tile>
      )}

      {!isValid && totalAmount === 0 && (
        <InlineNotification
          kind="info"
          title="Enter at least one amount"
          subtitle="Fill in the member name, recorder, and at least one giving category."
          lowContrast
          hideCloseButton
        />
      )}

      <Stack orientation="horizontal" gap={3} style={{ flexWrap: "wrap" }}>
        <Button kind="primary" size="lg" disabled={!isValid} onClick={onReview}>
          Review &amp; Confirm
        </Button>
      </Stack>
    </Stack>
  );
}
