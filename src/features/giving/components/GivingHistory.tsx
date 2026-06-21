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
} from "@carbon/react";
import type { GivingRecord } from "@/features/giving/types";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";
import {
  formatShortDate,
  formatUGX,
  getFrequencyLabel,
  getTitheFromEntries,
  getOfferingsFromEntries,
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
  { key: "method", header: "Method" },
  { key: "frequency", header: "Frequency" },
  { key: "categories", header: "Categories" },
];

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
    method: record.method.replace(/_/g, " "),
    frequency: getFrequencyLabel(record.frequency),
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
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </Stack>
  );
}
