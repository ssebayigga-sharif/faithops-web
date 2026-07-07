import { useRef } from "react";
import { Button, Stack, Tag, Tile } from "@carbon/react";
import { CheckmarkFilled, Download, Renew } from "@carbon/icons-react";
import type { GivingRecord } from "@/features/giving/types";
import {
  formatUGX,
  formatShortDate,
  getCategoryLabel,
  getTitheFromEntries,
  getOfferingsFromEntries,
} from "../givingUtils";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";

interface GivingReceiptProps {
  record: GivingRecord;
  onNewRecord: () => void;
}

export function GivingReceipt({ record, onNewRecord }: GivingReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const titheTotal = getTitheFromEntries(record.entries);
  const offeringsTotal = getOfferingsFromEntries(record.entries);

  return (
    <Stack gap={5} className="giving-receipt">
      {/* Success header */}
      <Stack
        className="giving-receipt__header"
        orientation="horizontal"
        gap={4}
      >
        <CheckmarkFilled size={32} className="giving-receipt__check" />
        <Stack gap={1}>
          <h2 className="giving-receipt__title">
            Giving recorded successfully
          </h2>
          <p className="giving-receipt__subtitle">
            Receipt {record.receiptNumber} · {formatShortDate(record.date)}
          </p>
        </Stack>
      </Stack>

      {/* Receipt tile */}
      <div ref={receiptRef} className="giving-receipt__document">
        <Tile className="giving-receipt__tile">
          {/* Church header */}
          <Stack className="giving-receipt__church-header" gap={1}>
            <h3>Kabulengwa Seventh-day Adventist Church</h3>
            <p>Official Tithe &amp; Offering Receipt</p>
            <p className="giving-receipt__ref">
              Receipt No. <strong>{record.receiptNumber}</strong>
            </p>
          </Stack>

          <hr className="giving-receipt__divider" />

          {/* Member info */}
          <Stack
            className="giving-receipt__meta"
            orientation="horizontal"
            gap={5}
          >
            <Stack gap={1}>
              <span className="giving-receipt__meta-label">Member</span>
              <span className="giving-receipt__meta-value">
                {record.memberName}
              </span>
            </Stack>
            <Stack gap={1}>
              <span className="giving-receipt__meta-label">
                Sabbath attributed
              </span>
              <span className="giving-receipt__meta-value">
                {formatShortDate(record.sabbathDate)}
              </span>
            </Stack>
          </Stack>

          <hr className="giving-receipt__divider" />

          {/* Line items */}
          <Stack className="giving-receipt__line-items" gap={3}>
            <h4 className="giving-receipt__section-label">Giving breakdown</h4>
            {record.entries.map((entry) => {
              const category = GIVING_CATEGORIES.find(
                (c) => c.id === entry.categoryId,
              );
              return (
                <Stack
                  key={entry.categoryId}
                  className="giving-receipt__line-item"
                  orientation="horizontal"
                  gap={3}
                >
                  <span className="giving-receipt__line-label">
                    {getCategoryLabel(entry.categoryId)}
                    {category?.isTithe && (
                      <Tag
                        type="blue"
                        size="sm"
                        className="giving-receipt__tithe-tag"
                      >
                        Tithe
                      </Tag>
                    )}
                  </span>
                  <span className="giving-receipt__line-amount">
                    {formatUGX(entry.amount)}
                  </span>
                </Stack>
              );
            })}
          </Stack>

          <hr className="giving-receipt__divider" />

          {/* Summary totals */}
          <Stack className="giving-receipt__totals" gap={2}>
            {titheTotal > 0 && (
              <Stack
                className="giving-receipt__total-row"
                orientation="horizontal"
                gap={3}
              >
                <span>Tithe subtotal</span>
                <span>{formatUGX(titheTotal)}</span>
              </Stack>
            )}
            {offeringsTotal > 0 && (
              <Stack
                className="giving-receipt__total-row"
                orientation="horizontal"
                gap={3}
              >
                <span>Offerings subtotal</span>
                <span>{formatUGX(offeringsTotal)}</span>
              </Stack>
            )}
            <Stack
              className="giving-receipt__total-row giving-receipt__total-row--grand"
              orientation="horizontal"
              gap={3}
            >
              <span>Total</span>
              <span>{formatUGX(record.totalAmount)}</span>
            </Stack>
          </Stack>

          <hr className="giving-receipt__divider" />

          {/* Scripture footer */}
          <Stack className="giving-receipt__scripture" gap={1}>
            <p className="giving-receipt__scripture-text">
              "Bring the whole tithe into the storehouse, that there may be food
              in my house. Test me in this… and see if I will not throw open the
              floodgates of heaven and pour out so much blessing that there will
              not be room enough to store it."
            </p>
            <p className="giving-receipt__scripture-ref">
              — Malachi 3:10 (NIV)
            </p>
          </Stack>

          <Stack
            className="giving-receipt__footer"
            orientation="horizontal"
            gap={5}
          >
            <span>Date: {formatShortDate(record.date)}</span>
          </Stack>
        </Tile>
      </div>

      {/* Actions */}
      <Stack orientation="horizontal" gap={3}>
        <Button kind="secondary" renderIcon={Download} onClick={handlePrint}>
          Print Receipt
        </Button>
        <Button kind="primary" renderIcon={Renew} onClick={onNewRecord}>
          Record Another
        </Button>
      </Stack>
    </Stack>
  );
}
