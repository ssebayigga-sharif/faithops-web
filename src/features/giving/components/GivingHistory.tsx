import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Select,
  SelectItem,
  Stack,
  Grid,
  Column,
  Button,
} from "@carbon/react";
import { DocumentExport } from "@carbon/icons-react";
import type { GivingRecord } from "../types";
import { GIVING_CATEGORIES } from "../data/giving";
import {
  formatShortDate,
  formatUGX,
  getTitheFromEntries,
  getOfferingsFromEntries,
  getCategoryLabel,
} from "../givingUtils";
import { colors } from "./givingStyles";

interface GivingHistoryProps {
  records: GivingRecord[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (categoryId: string) => void;
  dateFromFilter: string;
  onDateFromChange: (date: string) => void;
  dateToFilter: string;
  onDateToChange: (date: string) => void;
}

const HEADERS = [
  { key: "receiptNumber", header: "Receipt" },
  { key: "memberName", header: "Member" },
  { key: "sabbathDate", header: "Sabbath" },
  { key: "tithe", header: "Tithe" },
  { key: "offerings", header: "Offerings" },
  { key: "totalAmount", header: "Total" },
  { key: "categories", header: "Categories" },
];

function printReceipt(record: GivingRecord): void {
  const entriesHTML = record.entries
    .map(
      (entry) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #ddd;">${getCategoryLabel(entry.categoryId)}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">UGX ${entry.amount.toLocaleString("en-UG")}</td>
        </tr>`,
    )
    .join("");

  const titheTotal = getTitheFromEntries(record.entries);
  const offeringTotal = getOfferingsFromEntries(record.entries);

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt ${record.receiptNumber}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 2rem; max-width: 700px; margin: 0 auto; color: #222; }
        .header { text-align: center; margin-bottom: 1.5rem; }
        .header h1 { margin: 0; font-size: 1.4rem; }
        .header p { margin: 0.25rem 0; color: #555; font-size: 0.9rem; }
        .receipt-no { font-size: 0.85rem; color: #777; margin-top: 0.25rem; }
        hr { border: none; border-top: 1px solid #ccc; margin: 1rem 0; }
        .meta { display: flex; flex-wrap: wrap; gap: 2rem; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .meta-label { color: #777; display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .meta-value { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th { text-align: left; padding: 8px; border-bottom: 2px solid #333; font-size: 0.85rem; }
        td { font-size: 0.9rem; }
        .grand-total td { font-weight: 700; font-size: 1.1rem; border-top: 2px solid #333; padding-top: 10px; }
        .subtotal td { border-top: 1px solid #ccc; }
        .scripture { text-align: center; font-style: italic; color: #555; font-size: 0.85rem; margin-top: 1.5rem; }
        .footer { display: flex; justify-content: space-between; font-size: 0.8rem; color: #777; margin-top: 1rem; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Kabulengwa Seventh-day Adventist Church</h1>
        <p>Official Tithe & Offering Receipt</p>
        <p class="receipt-no">Receipt No. <strong>${record.receiptNumber}</strong></p>
      </div>
      <hr />
      <div class="meta">
        <div><span class="meta-label">Member</span><span class="meta-value">${record.memberName}</span></div>
        <div><span class="meta-label">Sabbath</span><span class="meta-value">${formatShortDate(record.sabbathDate)}</span></div>
        <div><span class="meta-label">Date recorded</span><span class="meta-value">${formatShortDate(record.date)}</span></div>
      </div>
      <hr />
      <h3 style="font-size:0.9rem;margin:0.5rem 0;">Giving breakdown</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th style="text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${entriesHTML}
          ${titheTotal > 0 ? `<tr class="subtotal"><td style="padding:8px;"><strong>Tithe subtotal</strong></td><td style="padding:8px;text-align:right;"><strong>UGX ${titheTotal.toLocaleString("en-UG")}</strong></td></tr>` : ""}
          ${offeringTotal > 0 ? `<tr class="subtotal"><td style="padding:8px;"><strong>Offerings subtotal</strong></td><td style="padding:8px;text-align:right;"><strong>UGX ${offeringTotal.toLocaleString("en-UG")}</strong></td></tr>` : ""}
          <tr class="grand-total">
            <td style="padding:8px;"><strong>Grand Total</strong></td>
            <td style="padding:8px;text-align:right;"><strong>UGX ${record.totalAmount.toLocaleString("en-UG")}</strong></td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div class="scripture">
        <p>"Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this… and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it."</p>
        <p>— Malachi 3:10 (NIV)</p>
      </div>
      <hr />
      <div class="footer">
        <span>Date: ${formatShortDate(record.date)}</span>
      </div>
      <div style="text-align:center;margin-top:1.5rem;">
        <button onclick="window.print()" style="padding:10px 24px;font-size:1rem;border:1px solid #0f62fe;background:#0f62fe;color:#fff;border-radius:4px;cursor:pointer;">
          Print Receipt
        </button>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export function GivingHistory({
  records,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  dateFromFilter,
  onDateFromChange,
  dateToFilter,
  onDateToChange,
}: GivingHistoryProps) {
  if (records.length === 0) {
    return (
      <Stack gap={3} style={{ padding: "1rem 0" }}>
        <p>No giving records found.</p>
        <p
          style={{
            fontSize: "13px",
            color: colors.textMuted,
          }}
        >
          Records are persisted in your browser. Start by recording a giving
          entry.
        </p>
      </Stack>
    );
  }

  // Build category tags for display
  const getCategoryTags = (record: GivingRecord): string => {
    return record.entries
      .map((e) => {
        const cat = GIVING_CATEGORIES.find((c) => c.id === e.categoryId);
        return cat?.label ?? e.categoryId;
      })
      .join(", ");
  };

  const rows = records.map((record) => ({
    id: record.id,
    receiptNumber: record.receiptNumber,
    memberName: record.memberName,
    sabbathDate: formatShortDate(record.sabbathDate),
    tithe: formatUGX(getTitheFromEntries(record.entries)),
    offerings: formatUGX(getOfferingsFromEntries(record.entries)),
    totalAmount: formatUGX(record.totalAmount),
    categories: getCategoryTags(record),
    _raw: record,
  }));

  return (
    <Stack gap={4}>
      {/* Filters */}
      <Grid fullWidth condensed>
        <Column sm={4} md={4} lg={6}>
          <Select
            id="category-filter"
            labelText="Filter by category"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <SelectItem value="" text="All categories" />
            {GIVING_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} text={cat.label} />
            ))}
          </Select>
        </Column>
        <Column sm={4} md={4} lg={5}>
          <input
            type="date"
            id="date-from"
            value={dateFromFilter}
            onChange={(e) => onDateFromChange(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              fontFamily: "inherit",
              fontSize: "14px",
              marginTop: "1.5rem",
              background: colors.white,
              color: colors.text,
            }}
            aria-label="Filter from date"
          />
        </Column>
        <Column sm={4} md={4} lg={5}>
          <input
            type="date"
            id="date-to"
            value={dateToFilter}
            onChange={(e) => onDateToChange(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              fontFamily: "inherit",
              fontSize: "14px",
              marginTop: "1.5rem",
              background: colors.white,
              color: colors.text,
            }}
            aria-label="Filter to date"
          />
        </Column>
      </Grid>

      {/* Table */}
      <DataTable rows={rows} headers={HEADERS} isSortable>
        {({
          rows: tableRows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getToolbarProps,
          onInputChange,
          getTableContainerProps,
        }) => (
          <TableContainer
            title="Giving records"
            description={`${records.length} record${records.length !== 1 ? "s" : ""}`}
            {...getTableContainerProps()}
          >
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => {
                    const val =
                      typeof e === "string" ? e : (e?.target?.value ?? e ?? "");
                    onSearchChange(val);
                    (onInputChange as (val: string) => void)(val);
                  }}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} size="md">
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => {
                  const rawRecord = records.find(
                    (r) => r.id === row.id,
                  ) as GivingRecord;
                  return (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                      <TableCell>
                        <Button
                          kind="ghost"
                          size="sm"
                          renderIcon={DocumentExport}
                          iconDescription={`Print receipt ${rawRecord?.receiptNumber ?? ""}`}
                          onClick={() => rawRecord && printReceipt(rawRecord)}
                        >
                          Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </Stack>
  );
}
