import { useRef } from "react";
import {
  Button,
  Column,
  Grid,
  Select,
  SelectItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tile,
} from "@carbon/react";
import { Download, DocumentPdf } from "@carbon/icons-react";
import type {
  GivingRecord,
  YearlySummary,
  MonthlySummary,
  GivingReport,
} from "@/features/giving/types";
import { GIVING_CATEGORIES } from "@/features/giving/data/giving";
import {
  formatUGX,
  formatMonthLabel,
  formatShortDate,
  buildYearlySummary,
  buildMonthlySummary,
  buildReport,
} from "../givingUtils";
import { colors } from "./givingStyles";

interface GivingReportsProps {
  records: GivingRecord[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  reportFromDate: string;
  onFromDateChange: (date: string) => void;
  reportToDate: string;
  onToDateChange: (date: string) => void;
  activeReportTab: "monthly" | "yearly" | "custom";
  onReportTabChange: (tab: "monthly" | "yearly" | "custom") => void;
  availableYears: string[];
  availableMonths: string[];
}

export function GivingReports({
  records,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  reportFromDate,
  onFromDateChange,
  reportToDate,
  onToDateChange,
  activeReportTab,
  onReportTabChange,
  availableYears,
  availableMonths,
}: GivingReportsProps) {
  const printRef = useRef<HTMLDivElement>(
    null!,
  ) as React.RefObject<HTMLDivElement>;

  const handlePrint = () => {
    window.print();
  };

  const tabIndex =
    activeReportTab === "monthly" ? 0 : activeReportTab === "yearly" ? 1 : 2;

  const monthlySum = buildMonthlySummary(records, selectedMonth);
  const yearlySum = buildYearlySummary(records, selectedYear);
  const customReport = buildReport(records, reportFromDate, reportToDate);

  return (
    <Stack gap={5}>
      <Stack gap={1}>
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 600,
            color: colors.text,
          }}
        >
          Giving Reports
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: colors.textMuted,
          }}
        >
          Generate monthly, yearly, or custom period giving summaries for
          financial transparency and accountability.
        </p>
      </Stack>

      <Tabs
        selectedIndex={tabIndex}
        onChange={({ selectedIndex }) => {
          const tabs = ["monthly", "yearly", "custom"] as const;
          onReportTabChange(tabs[selectedIndex]);
        }}
      >
        <TabList aria-label="Report types">
          <Tab>Monthly Report</Tab>
          <Tab>Yearly Report</Tab>
          <Tab>Custom Period</Tab>
        </TabList>

        <TabPanels>
          {/* Monthly Report */}
          <TabPanel>
            <Stack gap={4}>
              <Grid fullWidth condensed>
                <Column sm={4} md={4} lg={6}>
                  <Select
                    id="report-month"
                    labelText="Select month"
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                  >
                    {availableMonths.length > 0 ? (
                      availableMonths.map((m) => (
                        <SelectItem
                          key={m}
                          value={m}
                          text={formatMonthLabel(m)}
                        />
                      ))
                    ) : (
                      <SelectItem
                        value={selectedMonth}
                        text={formatMonthLabel(selectedMonth)}
                      />
                    )}
                  </Select>
                </Column>
              </Grid>
              <ReportView
                title={`Monthly Report — ${formatMonthLabel(selectedMonth)}`}
                totals={monthlySum}
                printRef={printRef}
                onPrint={handlePrint}
              />
            </Stack>
          </TabPanel>

          {/* Yearly Report */}
          <TabPanel>
            <Stack gap={4}>
              <Grid fullWidth condensed>
                <Column sm={4} md={4} lg={6}>
                  <Select
                    id="report-year"
                    labelText="Select year"
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                  >
                    {availableYears.length > 0 ? (
                      availableYears.map((y) => (
                        <SelectItem key={y} value={y} text={y} />
                      ))
                    ) : (
                      <SelectItem value={selectedYear} text={selectedYear} />
                    )}
                  </Select>
                </Column>
              </Grid>
              <YearlyReportView summary={yearlySum} onPrint={handlePrint} />
            </Stack>
          </TabPanel>

          {/* Custom Period */}
          <TabPanel>
            <Stack gap={4}>
              <Grid fullWidth condensed>
                <Column sm={4} md={4} lg={6}>
                  <input
                    type="date"
                    id="report-from"
                    value={reportFromDate}
                    onChange={(e) => onFromDateChange(e.target.value)}
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
                    aria-label="Report from date"
                  />
                </Column>
                <Column sm={4} md={4} lg={6}>
                  <input
                    type="date"
                    id="report-to"
                    value={reportToDate}
                    onChange={(e) => onToDateChange(e.target.value)}
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
                    aria-label="Report to date"
                  />
                </Column>
              </Grid>
              <CustomReportView report={customReport} onPrint={handlePrint} />
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

// Monthly Report View

function ReportView({
  title,
  totals,
  printRef,
  onPrint,
}: {
  title: string;
  totals: MonthlySummary;
  printRef: React.RefObject<HTMLDivElement | null>;
  onPrint: () => void;
}) {
  return (
    <Stack gap={4}>
      <div ref={printRef}>
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

            {/* Summary metrics */}
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

// ─── Yearly Report View ───────────────────────────────────────────────────────

function YearlyReportView({
  summary,
  onPrint,
}: {
  summary: YearlySummary;
  onPrint: () => void;
}) {
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
              Yearly Report — {summary.year}
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: colors.textMuted }}>
              {summary.recordCount} record
              {summary.recordCount !== 1 ? "s" : ""} across 12 months
            </p>
          </Stack>

          {/* Yearly totals per category */}
          <Grid fullWidth condensed>
            {GIVING_CATEGORIES.filter(
              (c) => (summary.byCategory[c.id] ?? 0) > 0,
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
                    {formatUGX(summary.byCategory[cat.id] ?? 0)}
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
                  {formatUGX(summary.totalAmount)}
                </strong>
              </Stack>
            </Column>
          </Grid>

          {/* Monthly breakdown */}
          <Stack gap={2}>
            <h4
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: colors.text,
              }}
            >
              Monthly Breakdown
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
                    Month
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Records
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Tithe
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Offerings
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.monthlyBreakdown
                  .filter((m) => m.recordCount > 0)
                  .map((month) => (
                    <tr key={month.month}>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                        }}
                      >
                        {formatMonthLabel(month.month)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                        }}
                      >
                        {month.recordCount}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                        }}
                      >
                        {formatUGX(month.totalTithe)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                        }}
                      >
                        {formatUGX(month.totalOfferings)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {formatUGX(month.totalAmount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--cds-layer-02, #f4f4f4)" }}>
                  <td
                    style={{
                      padding: "0.5rem",
                      fontWeight: 600,
                    }}
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
                    {summary.recordCount}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {formatUGX(summary.totalTithe)}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {formatUGX(summary.totalOfferings)}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    {formatUGX(summary.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Stack>
        </Stack>
      </Tile>

      <div>
        <Button kind="secondary" renderIcon={DocumentPdf} onClick={onPrint}>
          Print Yearly Report
        </Button>
      </div>
    </Stack>
  );
}

// ─── Custom Report View ───────────────────────────────────────────────────────

function CustomReportView({
  report,
  onPrint,
}: {
  report: GivingReport;
  onPrint: () => void;
}) {
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

          {/* Category totals */}
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

          {/* Record list */}
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
                    style={{
                      padding: "0.5rem",
                      fontWeight: 600,
                    }}
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
