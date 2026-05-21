import { Button, Stack, Tag, Tile } from "@carbon/react";
import { ArrowLeft, Checkmark } from "@carbon/icons-react";
import type { GivingEntry } from "../../churchTypes/givingTypes";
import { GIVING_CATEGORIES } from "../../churchTypes/givingTypes";
import type { GivingFormState } from "./useGiving";
import {
  formatShortDate,
  formatUGX,
  getCategoryLabel,
  getFrequencyLabel,
  getOfferingsFromEntries,
  getTitheFromEntries,
} from "./givingUtils";

interface GivingReviewProps {
  form: GivingFormState;
  entries: GivingEntry[];
  totalAmount: number;
  onBack: () => void;
  onSubmit: () => void;
}

export function GivingReview({
  form,
  entries,
  totalAmount,
  onBack,
  onSubmit,
}: GivingReviewProps) {
  const titheTotal = getTitheFromEntries(entries);
  const offeringsTotal = getOfferingsFromEntries(entries);

  return (
    <Stack gap={5} className="giving-review">
      <Stack gap={1}>
        <h2 className="giving-review__title">Review before confirming</h2>
        <p className="giving-review__subtitle">
          Verify the details below. Once confirmed, a receipt will be generated.
        </p>
      </Stack>

      {/* Member + context */}
      <Tile className="giving-review__section">
        <Stack gap={3}>
          <h3 className="giving-review__section-label">Member details</h3>
          <Stack
            className="giving-review__row-grid"
            orientation="horizontal"
            gap={5}
          >
            <Stack gap={1}>
              <span className="giving-review__meta-label">Member</span>
              <span className="giving-review__meta-value">
                {form.memberName}
              </span>
            </Stack>
            <Stack gap={1}>
              <span className="giving-review__meta-label">Sabbath date</span>
              <span className="giving-review__meta-value">
                {formatShortDate(form.sabbathDate)}
              </span>
            </Stack>
            <Stack gap={1}>
              <span className="giving-review__meta-label">Method</span>
              <span className="giving-review__meta-value">
                {form.method.replace(/_/g, " ")}
              </span>
            </Stack>
            <Stack gap={1}>
              <span className="giving-review__meta-label">Frequency</span>
              <span className="giving-review__meta-value">
                {getFrequencyLabel(form.frequency)}
              </span>
            </Stack>
            <Stack gap={1}>
              <span className="giving-review__meta-label">Recorded by</span>
              <span className="giving-review__meta-value">
                {form.recordedBy}
              </span>
            </Stack>
          </Stack>
        </Stack>
      </Tile>

      {/* Line items */}
      <Tile className="giving-review__section">
        <Stack gap={4}>
          <h3 className="giving-review__section-label">Giving breakdown</h3>
          <Stack gap={3}>
            {entries.map((entry) => {
              const category = GIVING_CATEGORIES.find(
                (c) => c.id === entry.categoryId,
              );
              return (
                <Stack
                  key={entry.categoryId}
                  className="giving-review__line-item"
                  orientation="horizontal"
                  gap={3}
                >
                  <Stack orientation="horizontal" gap={2}>
                    <span>{getCategoryLabel(entry.categoryId)}</span>
                    {category?.isTithe && (
                      <Tag type="blue" size="sm">
                        Tithe
                      </Tag>
                    )}
                  </Stack>
                  <strong>{formatUGX(entry.amount)}</strong>
                </Stack>
              );
            })}
          </Stack>

          <hr className="giving-review__divider" />

          <Stack gap={2}>
            {titheTotal > 0 && (
              <Stack
                className="giving-review__subtotal-row"
                orientation="horizontal"
                gap={3}
              >
                <span>Tithe subtotal</span>
                <span>{formatUGX(titheTotal)}</span>
              </Stack>
            )}
            {offeringsTotal > 0 && (
              <Stack
                className="giving-review__subtotal-row"
                orientation="horizontal"
                gap={3}
              >
                <span>Offerings subtotal</span>
                <span>{formatUGX(offeringsTotal)}</span>
              </Stack>
            )}
            <Stack
              className="giving-review__grand-total"
              orientation="horizontal"
              gap={3}
            >
              <strong>Total</strong>
              <strong>{formatUGX(totalAmount)}</strong>
            </Stack>
          </Stack>
        </Stack>
      </Tile>

      {form.notes && (
        <Tile className="giving-review__section">
          <Stack gap={1}>
            <span className="giving-review__meta-label">Notes</span>
            <p>{form.notes}</p>
          </Stack>
        </Tile>
      )}

      {/* Stewardship reminder */}
      <Tile className="giving-review__scripture-tile">
        <p className="giving-review__scripture">
          "Honor the Lord with your wealth, with the firstfruits of all your
          crops; then your barns will be filled to overflowing." — Proverbs
          3:9–10
        </p>
      </Tile>

      {/* Actions */}
      <Stack orientation="horizontal" gap={3}>
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={onBack}>
          Back to edit
        </Button>
        <Button kind="primary" renderIcon={Checkmark} onClick={onSubmit}>
          Confirm &amp; Generate Receipt
        </Button>
      </Stack>
    </Stack>
  );
}
