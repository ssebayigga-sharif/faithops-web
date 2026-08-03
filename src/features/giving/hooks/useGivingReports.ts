import { useMemo, useState } from "react";
import type {
  GivingRecord,
  YearlySummary,
  MonthlySummary,
} from "../types";
import {
  buildYearlySummary,
  buildMonthlySummary,
  buildReport,
  getAvailableYears,
  getAvailableMonths,
} from "../givingUtils";

export type ReportTab = "monthly" | "yearly" | "custom";

export function useGivingReports(history: GivingRecord[]) {
  const [selectedYear, setSelectedYear] = useState<string>(() =>
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    new Date().toISOString().slice(0, 7),
  );
  const [reportFromDate, setReportFromDate] = useState<string>(
    () => new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
  );
  const [reportToDate, setReportToDate] = useState<string>(
    () => new Date().toISOString().split("T")[0],
  );
  const [activeReportTab, setActiveReportTab] = useState<ReportTab>("monthly");

  const yearlySummary = useMemo(
    () => buildYearlySummary(history, selectedYear),
    [history, selectedYear],
  );
  const monthlySummary = useMemo(
    () => buildMonthlySummary(history, selectedMonth),
    [history, selectedMonth],
  );
  const customReport = useMemo(
    () => buildReport(history, reportFromDate, reportToDate),
    [history, reportFromDate, reportToDate],
  );
  const availableYears = useMemo(() => getAvailableYears(history), [history]);
  const availableMonths = useMemo(() => getAvailableMonths(history), [history]);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    reportFromDate,
    setReportFromDate,
    reportToDate,
    setReportToDate,
    activeReportTab,
    setActiveReportTab,
    yearlySummary,
    monthlySummary,
    customReport,
    availableYears,
    availableMonths,
  };
}
