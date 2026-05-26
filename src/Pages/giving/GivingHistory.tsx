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
  Tag,
  Stack,
} from "@carbon/react";
import type { GivingRecord } from "../../churchTypes/giving";
import {
  formatShortDate,
  formatUGX,
  getFrequencyLabel,
  getTitheFromEntries,
  getOfferingsFromEntries,
} from "./givingUtils";

interface GivingHistoryProps {
  records: GivingRecord[];
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
];

export function GivingHistory({ records }: GivingHistoryProps) {
  if (records.length === 0) {
    return (
      <Stack gap={3} className="giving-history__empty">
        <p>No giving records have been recorded in this session.</p>
        <p className="giving-history__empty-hint">
          Records recorded during this session will appear here.
        </p>
      </Stack>
    );
  }

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
    _raw: record,
  }));

  return (
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
          description="All giving entries recorded in this session"
          {...getTableContainerProps()}
        >
          <TableToolbar {...getToolbarProps()}>
            <TableToolbarContent>
              <TableToolbarSearch onChange={onInputChange} />
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
  );
}
