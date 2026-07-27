import { useState } from "react";
import { useGivingForm } from "./hooks/useGivingForm";
import { useGivingHistory } from "./hooks/useGivingHistory";
import { useGivingReports } from "./hooks/useGivingReports";

export type GivingTabId = "record" | "history" | "summary" | "reports";

export function useGiving() {
  const isAdmin: boolean = true;
  const currentUserId = "";
  const currentUserName = "";

  const form = useGivingForm(isAdmin, currentUserId, currentUserName, () => {
    // record submission handled inside useGivingForm
  });

  const history = useGivingHistory(isAdmin, currentUserId, currentUserName);

  const [memberStatementName, setMemberStatementName] = useState("");
  const [memberStatement, setMemberStatement] = useState<any[]>([]);
  const [memberStatementTotal, setMemberStatementTotal] = useState(0);
  const [activeTab, setActiveTab] = useState<GivingTabId>("record");

  const reports = useGivingReports(history.history);

  return {
    isAdmin,
    activeTab,
    setActiveTab,
    ...form,
    ...history,
    ...reports,
    memberStatementName,
    setMemberStatementName,
    memberStatement,
    memberStatementTotal,
    setMemberStatement,
    setMemberStatementTotal,
  };
}
