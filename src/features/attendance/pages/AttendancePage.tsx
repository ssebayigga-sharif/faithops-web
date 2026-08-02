import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tile,
  InlineNotification,
  DataTableSkeleton,
  Button,
} from "@carbon/react";
import { EventSchedule, List, Police, UserFollow } from "@carbon/icons-react";

import { StatCards } from "../components/StatCards";
import { MarkAttendanceTable } from "../components/MarkAttendanceTable";
import { SessionHistoryTable } from "../components/SessionHistoryTable";
import { VisitorsTable } from "../components/VisitorsTable";
import { FollowUpModal } from "../components/FollowUpModal";
import { SessionConfig } from "../components/SessionConfig";
import { VisitorQuickAdd } from "../components/VisitorQuickAdd";
import { VisitorList } from "../components/VisitorList";
import { VisitorFollowUpModal } from "../components/VisitorFollowUpModal";
import {
  useMembers,
  useSessions,
  useBulkSaveAttendance,
  useAttendanceRows,
  useAttendanceStats,
  useVisitors,
  useFollowUpCandidates,
  useCreateFollowUpTask,
  useUpdateVisitorFollowUp,
  useEvents,
  useSessionRecords,
} from "../hooks/useAttendance";
import type {
  AttendanceRow,
  AttendanceStatus,
  ServiceType,
  VisitorRowPayload,
  VisitorRecord,
} from "../types";
import styles from "../attendance.module.scss";

const SERVICE_TYPES: ServiceType[] = [
  "Sabbath Programmes",
  "Wednesday Fellowship",
  "Prayer and Fasting",
  "Friday Prayer",
  "Special Event",
];

const toIsoDate = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isSaturday = (d: Date): boolean => d.getDay() === 6;

const isOlderThanTwoMonths = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  return date < twoMonthsAgo;
};

export const AttendancePage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [serviceType, setServiceType] =
    useState<ServiceType>("Sabbath Programmes");
  const [markedBy, setMarkedBy] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorNotes, setVisitorNotes] = useState("");
  const [visitors, setVisitors] = useState<VisitorRowPayload[]>([]);
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: allVisitors = [] } = useVisitors();
  const { data: followUpCandidates = [] } = useFollowUpCandidates();
  const { data: events = [] } = useEvents();
  const createFollowUp = useCreateFollowUpTask();
  const updateVisitorFollowUp = useUpdateVisitorFollowUp();

  const currentSessionId = useMemo(
    () =>
      `${toIsoDate(date)}_${serviceType.replace(/\s+/g, "_").toLowerCase()}`,
    [date, serviceType],
  );
  const { data: existingRecords = [] } = useSessionRecords(currentSessionId);
  const initialRows = useAttendanceRows(members);
  const [rows, setRows] = useState<AttendanceRow[]>([]);

  useEffect(() => {
    if (existingRecords.length > 0) {
      setRows(
        initialRows.map((r) => {
          const existing = existingRecords.find(
            (rec) => rec.memberId === r.memberId,
          );
          return existing
            ? {
                ...r,
                status: existing.status as AttendanceStatus,
                notes: existing.notes,
              }
            : r;
        }),
      );
    } else {
      setRows(initialRows);
    }
  }, [initialRows, existingRecords]);

  const eventServiceTypes = useMemo(() => {
    const categories = new Set<string>();
    events.forEach((ev) => {
      if (ev.category) categories.add(ev.category);
    });
    return [...new Set([...SERVICE_TYPES, ...categories])];
  }, [events]);

  useEffect(() => {
    if (isSaturday(date) && serviceType !== "Sabbath Programmes")
      setServiceType("Sabbath Programmes");
  }, [date, serviceType]);

  const recentSessions = useMemo(
    () => sessions.filter((s) => !isOlderThanTwoMonths(s.date)),
    [sessions],
  );
  const stats = useAttendanceStats(recentSessions);

  const liveSession =
    rows.length > 0
      ? {
          id: "",
          date: toIsoDate(date),
          serviceType,
          totalPresent: rows.filter((r) => r.status === "present").length,
          totalAbsent: rows.filter((r) => r.status === "absent").length,
          totalLate: rows.filter((r) => r.status === "late").length,
          totalExcused: rows.filter((r) => r.status === "excused").length,
          totalVisitors: visitors.length,
          createdAt: "",
        }
      : null;

  const handleRowChange = useCallback(
    (memberId: string, field: keyof AttendanceRow, value: string) => {
      setRows((prev) =>
        prev.map((r) =>
          r.memberId === memberId ? { ...r, [field]: value } : r,
        ),
      );
    },
    [],
  );

  const handleBulkMark = useCallback((status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => ({ ...r, status })));
  }, []);

  const handleAddVisitor = useCallback(() => {
    if (!visitorName.trim() || !visitorPhone.trim()) return;
    setVisitors((prev) => [
      ...prev,
      {
        name: visitorName.trim(),
        phone: visitorPhone.trim(),
        email: visitorEmail.trim() || undefined,
        notes: visitorNotes.trim(),
      },
    ]);
    setVisitorName("");
    setVisitorPhone("");
    setVisitorEmail("");
    setVisitorNotes("");
  }, [visitorName, visitorPhone, visitorEmail, visitorNotes]);

  const handleRemoveVisitor = useCallback((index: number) => {
    setVisitors((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const saveMutation = useBulkSaveAttendance();

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        date: toIsoDate(date),
        serviceType,
        rows,
        visitors,
        markedBy: markedBy || "Admin",
      });
      setVisitors([]);
    } catch (error) {
      console.error(error);
    }
  };

  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const handleAutoFollowUp = async () => {
    setFollowUpModalOpen(true);
  };

  const [visitorFollowUpModalOpen, setVisitorFollowUpModalOpen] =
    useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(
    null,
  );

  const handleVisitorUpdate = useCallback((visitor: VisitorRecord) => {
    setSelectedVisitor(visitor);
    setVisitorFollowUpModalOpen(true);
  }, []);
  const handleVisitorFollowUpClose = useCallback(() => {
    setVisitorFollowUpModalOpen(false);
    setSelectedVisitor(null);
  }, []);
  const handleVisitorFollowUpSubmit = useCallback(async () => {
    if (!selectedVisitor) return;
    try {
      const sessionId = `${selectedVisitor.date}_${selectedVisitor.serviceType.replace(/\s+/g, "_").toLowerCase()}`;
      await updateVisitorFollowUp.mutateAsync({
        sessionId,
        visitorId: selectedVisitor.id,
        status: "contacted",
      });
      setVisitorFollowUpModalOpen(false);
      setSelectedVisitor(null);
    } catch (error) {
      console.error("Failed to update visitor follow-up:", error);
    }
  }, [selectedVisitor, updateVisitorFollowUp]);

  const handleVisitorStatusChange = useCallback(
    (status: VisitorRecord["followUpStatus"]) => {
      if (selectedVisitor) {
        setSelectedVisitor({ ...selectedVisitor, followUpStatus: status });
      }
    },
    [selectedVisitor],
  );

  return (
    <div className={styles.attendancepage}>
      <div className={styles.attendanceheader}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className={styles.attendanceheader__inner}>
              <div>
                <h1 className={styles.attendanceheader__title}>
                  Track Attendance
                </h1>
                <p className={styles.attendanceheader__subtitle}>
                  {stats.totalSessions > 0
                    ? `${stats.totalSessions} sessions recorded · ${stats.presentRate}% overall attendance · ${stats.totalVisitors} total visitors`
                    : "Record and manage service attendance"}
                </p>
              </div>
              {followUpCandidates.length > 0 && (
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={Police}
                  onClick={handleAutoFollowUp}
                >
                  {followUpCandidates.length} follow-up
                  {followUpCandidates.length > 1 ? "s" : ""} needed
                </Button>
              )}
            </div>
          </Column>
        </Grid>
      </div>

      <Grid>
        <Column lg={16} md={8} sm={4}>
          {saveMutation.isSuccess && (
            <InlineNotification
              kind="success"
              lowContrast
              title="Attendance saved successfully"
              subtitle="The session has been recorded. Member profiles synced."
              style={{ marginBottom: "1rem" }}
              onCloseButtonClick={() => saveMutation.reset()}
            />
          )}
          {saveMutation.isError && (
            <InlineNotification
              kind="error"
              lowContrast
              title="Failed to save attendance"
              subtitle={(saveMutation.error as Error)?.message}
              style={{ marginBottom: "1rem" }}
              onCloseButtonClick={() => saveMutation.reset()}
            />
          )}

          <Tabs>
            <TabList aria-label="Attendance sections" contained>
              <Tab renderIcon={EventSchedule}>Mark Attendance</Tab>
              <Tab renderIcon={List}>Session History</Tab>
              <Tab renderIcon={UserFollow}>Visitors</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Tile style={{ marginBottom: "1.5rem", marginTop: "1.5rem" }}>
                  <SessionConfig
                    date={date}
                    serviceType={serviceType}
                    markedBy={markedBy}
                    serviceTypes={eventServiceTypes}
                    onDateChange={setDate}
                    onServiceTypeChange={setServiceType}
                    onMarkedByChange={setMarkedBy}
                  />
                </Tile>

                <Tile style={{ marginBottom: "1rem" }}>
                  <VisitorQuickAdd
                    name={visitorName}
                    phone={visitorPhone}
                    email={visitorEmail}
                    notes={visitorNotes}
                    onNameChange={setVisitorName}
                    onPhoneChange={setVisitorPhone}
                    onEmailChange={setVisitorEmail}
                    onNotesChange={setVisitorNotes}
                    onAdd={handleAddVisitor}
                  />
                  <VisitorList
                    visitors={visitors}
                    onRemove={handleRemoveVisitor}
                  />
                </Tile>

                <StatCards session={liveSession} />

                {membersLoading ? (
                  <DataTableSkeleton columnCount={3} rowCount={8} />
                ) : (
                  <MarkAttendanceTable
                    rows={rows}
                    isSaving={saveMutation.isPending}
                    onRowChange={handleRowChange}
                    onBulkMark={handleBulkMark}
                    onSave={handleSave}
                  />
                )}
              </TabPanel>

              <TabPanel>
                <div style={{ marginTop: "1.5rem" }}>
                  <SessionHistoryTable
                    sessions={recentSessions}
                    isLoading={sessionsLoading}
                  />
                </div>
              </TabPanel>

              <TabPanel>
                <div style={{ marginTop: "1.5rem" }}>
                  <VisitorsTable
                    visitors={allVisitors}
                    onUpdateFollowUp={handleVisitorUpdate}
                  />
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>

      <FollowUpModal
        open={followUpModalOpen}
        candidates={followUpCandidates}
        isCreating={createFollowUp.isPending}
        onClose={() => setFollowUpModalOpen(false)}
        onCreateTask={async (candidate) => {
          try {
            await createFollowUp.mutateAsync({
              memberFirebaseKey: candidate.memberId,
              candidate,
            });
          } catch (error) {
            console.error("Failed to create follow-up task:", error);
          }
        }}
      />
      <VisitorFollowUpModal
        open={visitorFollowUpModalOpen}
        visitor={selectedVisitor}
        onClose={handleVisitorFollowUpClose}
        onSubmit={handleVisitorFollowUpSubmit}
        onStatusChange={handleVisitorStatusChange}
      />
    </div>
  );
};
