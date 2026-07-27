import { useMemo, useState, useEffect } from "react";
import type { GivingRecord } from "@/features/giving/types";
import {
  searchRecords,
  filterRecordsByDateRange,
  filterRecordsByCategory,
  loadRecords,
} from "../services/giving.service";

export function useGivingHistory(
  isAdmin: boolean,
  currentUserId: string,
  currentUserName: string,
) {
  const [history, setHistory] = useState<GivingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  useEffect(() => {
    void loadRecords().then((persisted) => {
      if (persisted.length > 0) setHistory(persisted);
    });
  }, []);

  const scopedHistory = useMemo(() => {
    if (isAdmin) return history;
    return history.filter(
      (r) => r.memberId === currentUserId || r.memberName === currentUserName,
    );
  }, [history, isAdmin, currentUserId, currentUserName]);

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

  return {
    history,
    scopedHistory,
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
