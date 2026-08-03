import { useCallback, useMemo, useState } from "react";
import type {
  GivingCategoryId,
  GivingEntry,
  GivingFormState,
  GivingStep,
  GivingRecord,
} from "../types";
import {
  getOfferingsFromEntries,
  getTitheFromEntries,
  getTotalFromEntries,
  generateReceiptNumber,
} from "../givingUtils";

const INITIAL_FORM: GivingFormState = {
  memberId: "",
  memberName: "",
  sabbathDate: "",
  entries: {},
  notes: "",
};

export function useGivingForm(
  isAdmin: boolean,
  currentUserId: string,
  currentUserName: string,
  onRecordSubmitted: (record: GivingRecord) => void,
) {
  const [step, setStep] = useState<GivingStep>("entry");
  const [form, setForm] = useState<GivingFormState>({
    ...INITIAL_FORM,
    memberId: isAdmin ? "" : currentUserId,
    memberName: isAdmin ? "" : currentUserName,
  });
  const [submittedRecord, setSubmittedRecord] = useState<GivingRecord | null>(
    null,
  );

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

  const applySuggestedTithe = useCallback(() => {
    setEntryAmount("tithe", "0");
  }, [setEntryAmount]);

  const isValid = useMemo(() => {
    return (
      form.memberName.trim().length > 0 &&
      form.sabbathDate.length > 0 &&
      parsedEntries.length > 0 &&
      totalAmount > 0
    );
  }, [form.memberName, form.sabbathDate, parsedEntries.length, totalAmount]);

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
    onRecordSubmitted(record);
    setStep("receipt");
  }, [form, parsedEntries, totalAmount, isValid, onRecordSubmitted]);

  const resetForm = useCallback(() => {
    const freshForm: GivingFormState = {
      ...INITIAL_FORM,
      memberId: isAdmin ? "" : currentUserId,
      memberName: isAdmin ? "" : currentUserName,
    };
    setForm(freshForm);
    setSubmittedRecord(null);
    setStep("entry");
  }, [isAdmin, currentUserId, currentUserName]);

  return {
    step,
    setStep,
    form,
    setField,
    setEntryAmount,
    clearEntry,
    applySuggestedTithe,
    parsedEntries,
    totalAmount,
    totalTithe,
    totalOfferings,
    isValid,
    submitRecord,
    resetForm,
    submittedRecord,
    setSubmittedRecord,
  };
}
