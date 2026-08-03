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
} from "../types";
import { GIVING_CATEGORIES } from "../data/giving";
import {
  formatUGX,
  formatMonthLabel,
  formatShortDate,
  buildYearlySummary,
  buildMonthlySummary,
  buildReport,
} from "../givingUtils";
import { colors } from "./givingStyles";
import { MonthlyReportView } from "./MonthlyReportView";
import { YearlyReportView } from "./YearlyReportView";
import { CustomReportView } from "./CustomReportView";

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
  const printRef = useRef<HTMLDivElement | null>(null);

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
              <MonthlyReportView
                title={`Monthly Report — ${formatMonthLabel(selectedMonth)}`}
                totals={monthlySum}
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
