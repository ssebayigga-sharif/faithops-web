import {
  Button,
  InlineNotification,
  Stack,
  TextInput,
  Tile,
} from "@carbon/react";
import type {
  GivingCategoryId,
  GivingFormState,
} from "@/features/giving/types";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";
import { formatUGX } from "../givingUtils";
import { colors, sectionDesc, tileSection } from "../components/givingStyles";

interface GivingFormProps {
  form: GivingFormState;
  totalAmount: number;
  totalTithe: number;
  totalOfferings: number;
  isValid: boolean;
  isAdmin: boolean;
  onSetField: <K extends keyof GivingFormState>(
    key: K,
    value: GivingFormState[K],
  ) => void;
  onSetEntryAmount: (categoryId: GivingCategoryId, raw: string) => void;
  onApplySuggestedTithe: () => void;
  onReview: () => void;
}

const trustFundCategories = GIVING_CATEGORIES.filter(
  (category) => category.group === "trust_fund",
);
const combinedOfferings = GIVING_CATEGORIES.filter(
  (category) => category.group === "combined_offerings",
);
const otherOfferings = GIVING_CATEGORIES.filter(
  (category) => category.group === "other_offerings",
);

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
  const renderCategoryRow = (category: (typeof GIVING_CATEGORIES)[number]) => {
    const value = form.entries[category.id] ?? "";

    return (
      <div
        key={category.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.35rem 0",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 600 }}>
            {category.label}
          </div>
          {category.subtitle && (
            <div style={{ fontSize: "12px", color: colors.textMuted }}>
              {category.subtitle}
            </div>
          )}
        </div>
        <TextInput
          id={`giving-${category.id}`}
          labelText=""
          type="number"
          min={0}
          size="sm"
          value={value}
          onChange={(event) =>
            onSetEntryAmount(category.id, event.target.value)
          }
          placeholder="0"
          style={{ minWidth: "110px" }}
        />
      </div>
    );
  };

  return (
    <Stack gap={6}>
      <Tile
        style={{
          ...tileSection,
          borderLeft: `3px solid ${colors.interactive}`,
        }}
      >
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px" }}>
              Record tithe and offerings
            </h3>
            <p style={{ ...sectionDesc, margin: "0.25rem 0 0" }}>
              Capture the member giving details and save them directly to the
              church records.
            </p>
          </div>

          <Stack gap={3}>
            <TextInput
              id="member-name"
              labelText="Member name"
              value={form.memberName}
              onChange={(event) => onSetField("memberName", event.target.value)}
              placeholder="Enter member name"
            />
            <TextInput
              id="sabbath-date"
              labelText="Sabbath date"
              type="date"
              value={form.sabbathDate}
              onChange={(event) =>
                onSetField("sabbathDate", event.target.value)
              }
            />
          </Stack>

          <Stack gap={3}>
            <h4 style={{ margin: 0 }}>Trust Fund</h4>
            {trustFundCategories.map(renderCategoryRow)}
          </Stack>

          <Stack gap={3}>
            <h4 style={{ margin: 0 }}>Combined Offerings</h4>
            {combinedOfferings.map(renderCategoryRow)}
          </Stack>

          <Stack gap={3}>
            <h4 style={{ margin: 0 }}>Other Offerings</h4>
            {otherOfferings.map(renderCategoryRow)}
          </Stack>

          <Tile style={{ background: "#f4f7fb", border: "1px solid #d0d7de" }}>
            <Stack gap={2}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "13px", color: colors.textMuted }}>
                  Total entered
                </span>
                <strong style={{ fontSize: "20px" }}>
                  {formatUGX(totalAmount)}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                  fontSize: "13px",
                }}
              >
                <span>Tithe: {formatUGX(totalTithe)}</span>
                <span>Offerings: {formatUGX(totalOfferings)}</span>
              </div>
            </Stack>
          </Tile>
        </Stack>
      </Tile>

      {!isValid && totalAmount === 0 && (
        <InlineNotification
          kind="info"
          title="Enter at least one amount"
          subtitle="Fill in the member name and at least one giving category."
          lowContrast
          hideCloseButton
        />
      )}

      <Stack orientation="horizontal" gap={3} style={{ flexWrap: "wrap" }}>
        <Button kind="primary" size="lg" disabled={!isValid} onClick={onReview}>
          Review & Confirm
        </Button>
      </Stack>
    </Stack>
  );
}
