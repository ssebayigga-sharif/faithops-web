import { useCallback, useMemo, useState, useEffect } from "react";
import type {
  GivingCategoryId,
  GivingEntry,
  GivingFrequency,
  GivingFormState,
  GivingStep,
  GivingMethod,
  GivingRecord,
  GivingReport,
  YearlySummary,
  MonthlySummary,
} from "@/features/giving/types";
import {
  generateReceiptNumber,
  getOfferingsFromEntries,
  getTitheFromEntries,
  getTotalFromEntries,
  getRecentSabbaths,
  buildYearlySummary,
  buildMonthlySummary,
  buildReport,
  getAvailableYears,
  getAvailableMonths,
} from "./givingUtils";
import {
  loadRecords,
  saveRecord as persistRecord,
  searchRecords,
  filterRecordsByDateRange,
  filterRecordsByCategory,
} from "./services/giving.service";

const INITIAL_FORM: GivingFormState = {
  memberId: "",
  memberName: "",
  sabbathDate: getRecentSabbaths(1)[0],
  entries: {},
  notes: "",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGiving() {
  const isAdmin: boolean = true;
  const currentUserId = "";
  const currentUserName = "";
  const [step, setStep] = useState<GivingStep>("entry");
  const [form, setForm] = useState<GivingFormState>({
    ...INITIAL_FORM,
    // Auto-populate for members: they give on their own behalf
    memberId: isAdmin ? "" : currentUserId,
    memberName: isAdmin ? "" : currentUserName,
  });
  const [submittedRecord, setSubmittedRecord] = useState<GivingRecord | null>(
    null,
  );
  const [history, setHistory] = useState<GivingRecord[]>([]);
  const [activeTab, setActiveTab] = useState<
    "record" | "history" | "summary" | "reports"
  >("record");

  // Load persisted records on mount
  useEffect(() => {
    void loadRecords().then((persisted) => {
      if (persisted.length > 0) {
        setHistory(persisted);
      }
    });
  }, []);

  // Filter history: members only see their own records; admins see all
  const scopedHistory = useMemo(() => {
    if (isAdmin) return history;
    return history.filter(
      (r) => r.memberId === currentUserId || r.memberName === currentUserName,
    );
  }, [history, isAdmin, currentUserId, currentUserName]);

  // ── Report state ──────────────────────────────────────────────────────────

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [reportFromDate, setReportFromDate] = useState<string>(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
  );
  const [reportToDate, setReportToDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const [activeReportTab, setActiveReportTab] = useState<
    "monthly" | "yearly" | "custom"
  >("monthly");

  const [memberStatementName, setMemberStatementName] = useState("");

  // ── Entry amounts parsed to numbers ──────────────────────────────────────

  const parsedEntries = useMemo((): GivingEntry[] => {
    return Object.entries(form.entries)
      .map(([categoryId, raw]) => ({
        categoryId: categoryId as GivingCategoryId,
        amount: parseFloat(raw ?? "0") || 0,
      }))
      .filter((e) => e.amount > 0);
  }, [form.entries]);

  const totalAmount = useMemo(
    () => getTotalFromEntries(parsedEntries),
    [parsedEntries],
  );
  const totalTithe = useMemo(
    () => getTitheFromEntries(parsedEntries),
    [parsedEntries],
  );
  const totalOfferings = useMemo(
    () => getOfferingsFromEntries(parsedEntries),
    [parsedEntries],
  );

  // ── Report computations (scoped to member's own data for members) ────────

  const monthlySummary = useMemo(
    () => buildMonthlySummary(scopedHistory, selectedMonth),
    [scopedHistory, selectedMonth],
  );

  const yearlySummary = useMemo(
    () => buildYearlySummary(scopedHistory, selectedYear),
    [scopedHistory, selectedYear],
  );

  const customReport = useMemo(
    () => buildReport(scopedHistory, reportFromDate, reportToDate),
    [scopedHistory, reportFromDate, reportToDate],
  );

  const availableYears = useMemo(
    () => getAvailableYears(scopedHistory),
    [scopedHistory],
  );
  const availableMonths = useMemo(
    () => getAvailableMonths(scopedHistory),
    [scopedHistory],
  );

  // ── Member statement ─────────────────────────────────────────────────────

  const memberStatement = useMemo((): GivingRecord[] => {
    if (!memberStatementName.trim()) return [];
    return scopedHistory.filter((r) =>
      r.memberName.toLowerCase().includes(memberStatementName.toLowerCase()),
    );
  }, [scopedHistory, memberStatementName]);

  const memberStatementTotal = useMemo(
    () => memberStatement.reduce((sum, r) => sum + r.totalAmount, 0),
    [memberStatement],
  );

  // ── Filtered history ─────────────────────────────────────────────────────

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const filteredHistory = useMemo(() => {
    let result = scopedHistory;
    if (searchQuery) result = searchRecords(result, searchQuery);
    if (categoryFilter)
      result = filterRecordsByCategory(result, categoryFilter);
    if (dateFromFilter && dateToFilter)
      result = filterRecordsByDateRange(result, dateFromFilter, dateToFilter);
    return result;
  }, [
    scopedHistory,
    searchQuery,
    categoryFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  // ── Form field updaters ───────────────────────────────────────────────────

  const setField = useCallback(
    <K extends keyof GivingFormState>(key: K, value: GivingFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setEntryAmount = useCallback(
    (categoryId: GivingCategoryId, raw: string) => {
      setForm((prev) => ({
        ...prev,
        entries: { ...prev.entries, [categoryId]: raw },
      }));
    },
    [],
  );

  const clearEntry = useCallback((categoryId: GivingCategoryId) => {
    setForm((prev) => {
      const { [categoryId]: _, ...rest } = prev.entries;
      return { ...prev, entries: rest };
    });
  }, []);

  // ── Tithe suggestion ──────────────────────────────────────────────────────

  const applySuggestedTithe = useCallback(() => {
    setEntryAmount("tithe", "0");
  }, [setEntryAmount]);

  // ── Validation ────────────────────────────────────────────────────────────

  const isValid = useMemo(() => {
    return (
      form.memberName.trim().length > 0 &&
      form.sabbathDate.length > 0 &&
      parsedEntries.length > 0 &&
      totalAmount > 0
    );
  }, [form.memberName, form.sabbathDate, parsedEntries.length, totalAmount]);

  // ── Submission ────────────────────────────────────────────────────────────

  const submitRecord = useCallback(() => {
    if (!isValid) return;

    const record: GivingRecord = {
      id: crypto.randomUUID(),
      memberId: form.memberId || crypto.randomUUID(),
      memberName: form.memberName,
      date: new Date().toISOString().split("T")[0],
      sabbathDate: form.sabbathDate,
      entries: parsedEntries,
      totalAmount,
      method: form.method,
      frequency: form.frequency,
      receiptNumber: generateReceiptNumber(),
      recordedBy: form.recordedBy,
      notes: form.notes,
      verified: false,
    };

    setSubmittedRecord(record);
    setHistory((prev) => [record, ...prev]);
    persistRecord(record);
    setStep("receipt");
  }, [form, parsedEntries, totalAmount, isValid]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    const freshForm: GivingFormState = {
      ...INITIAL_FORM,
      // Preserve auto-populate for members
      memberId: isAdmin ? "" : currentUserId,
      memberName: isAdmin ? "" : currentUserName,
    };
    setForm(freshForm);
    setSubmittedRecord(null);
    setStep("entry");
  }, [isAdmin, currentUserId, currentUserName]);

  return {
    // Role info
    isAdmin,
    // Step navigation
    step,
    setStep,
    // Form state
    form,
    setField,
    setEntryAmount,
    clearEntry,
    applySuggestedTithe,
    // Computed
    parsedEntries,
    totalAmount,
    totalTithe,
    totalOfferings,
    isValid,
    // Actions
    submitRecord,
    resetForm,
    // Data
    submittedRecord,
    history,
    // Tab navigation
    activeTab,
    setActiveTab,
    // Report state
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
    monthlySummary,
    yearlySummary,
    customReport,
    availableYears,
    availableMonths,
    // Member statement
    memberStatementName,
    setMemberStatementName,
    memberStatement,
    memberStatementTotal,
    // Filtered history
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    dateFromFilter,
    setDateFromFilter,
    dateToFilter,
    setDateToFilter,
    filteredHistory,
  };
}
