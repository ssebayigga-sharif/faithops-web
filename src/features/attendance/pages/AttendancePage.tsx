import React, { useState, useCallback } from "react";
import {
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
  SelectItem,
  DatePicker,
  DatePickerInput,
  TextInput,
  Tile,
  InlineNotification,
  DataTableSkeleton,
  Button,
  Modal,
} from "@carbon/react";
import { EventSchedule, List, UserFollow, Police } from "@carbon/icons-react";

import { StatCards } from "@/features/attendance/components/StatCards";
import { MarkAttendanceTable } from "@/features/attendance/components/MarkAttendanceTable";
import { SessionHistoryTable } from "@/features/attendance/components/SessionHistoryTable";
import { VisitorsTable } from "@/features/attendance/components/VisitorsTable";
import { FollowUpModal } from "@/features/attendance/components/FollowUpModal";
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
} from "@/features/attendance/hooks/useAttendance";
import type {
  AttendanceRow,
  AttendanceStatus,
  ServiceType,
  VisitorRowPayload,
  VisitorRecord,
} from "@/features/attendance/types";
import type { FollowUpCandidate } from "@/features/attendance/services/sync.services";

import styles from "@/features/attendance/attendance.module.scss";

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

const todayIso = toIsoDate(new Date());

export const AttendancePage: React.FC = () => {
  // ── Session config ────────────────────────────────────────
  const [date, setDate] = useState<Date>(new Date());
  const [serviceType, setServiceType] =
    useState<ServiceType>("Sabbath Programmes");
  const [markedBy, setMarkedBy] = useState("");

  // ── Visitor state ─────────────────────────────────────────
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorNotes, setVisitorNotes] = useState("");
  const [visitors, setVisitors] = useState<VisitorRowPayload[]>([]);

  // ── Data ──────────────────────────────────────────────────
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: allVisitors = [] } = useVisitors();
  const { data: followUpCandidates = [] } = useFollowUpCandidates();
  const createFollowUp = useCreateFollowUpTask();
  const updateVisitorFollowUp = useUpdateVisitorFollowUp();

  // ── Derived state ─────────────────────────────────────────
  const initialRows = useAttendanceRows(members);
  const [rows, setRows] = useState<AttendanceRow[]>([]);

  // Sync rows when members load (only initialise once)
  React.useEffect(() => {
    if (initialRows.length > 0 && rows.length === 0) {
      setRows(initialRows);
    }
  }, [initialRows, rows.length]);

  const stats = useAttendanceStats(sessions);

  // Build a live session object from current rows for stat cards
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

  // ── Row handlers ──────────────────────────────────────────
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

  // ── Visitor handlers ──────────────────────────────────────
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

  // ── Save ──────────────────────────────────────────────────
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
      setRows((prev) => prev.map((r) => ({ ...r, notes: "" })));
      setVisitors([]);
    } catch (error) {
      console.error("Failed to save attendance:", error);
    }
  };

  // ── Follow-up modal state ─────────────────────────────────
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);

  const handleAutoFollowUp = async () => {
    setFollowUpModalOpen(true);
  };

  // ── Visitor follow-up modal state ─────────────────────────
  const [visitorFollowUpModalOpen, setVisitorFollowUpModalOpen] =
    useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(
    null,
  );

  const handleVisitorUpdate = useCallback((visitor: VisitorRecord) => {
    setSelectedVisitor(visitor);
    setVisitorFollowUpModalOpen(true);
  }, []);

  return (
    <div className={styles.attendancepage}>
      {/* ── Page header ──────────────────────────────────── */}
      <div className={styles.attendanceheader}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className={styles.attendanceheader__inner}>
              <div>
                <h1 className={styles.attendanceheader__title}>
                  Attendance Tracking
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
              subtitle="The session has been recorded. Member profiles and events synced."
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
              {/* ── Tab 1: Mark attendance ─────────────── */}
              <TabPanel>
                <Tile style={{ marginBottom: "1.5rem", marginTop: "1.5rem" }}>
                  <div className={styles.attendancepage__config}>
                    <DatePicker
                      datePickerType="single"
                      dateFormat="m/d/Y"
                      value={date}
                      onChange={([d]) => {
                        if (d) setDate(d);
                      }}
                      maxDate={new Date().toLocaleDateString("en-US")}
                    >
                      <DatePickerInput
                        id="att-date"
                        labelText="Service Date"
                        placeholder="mm/dd/yyyy"
                      />
                    </DatePicker>

                    <Select
                      id="att-service"
                      labelText="Service Type"
                      value={serviceType}
                      onChange={(e) =>
                        setServiceType(e.target.value as ServiceType)
                      }
                    >
                      {SERVICE_TYPES.map((s) => (
                        <SelectItem key={s} value={s} text={s} />
                      ))}
                    </Select>

                    <TextInput
                      id="att-markedBy"
                      labelText="Marked By"
                      placeholder="Your name"
                      value={markedBy}
                      onChange={(e) => setMarkedBy(e.target.value)}
                    />
                  </div>
                </Tile>

                {/* Visitor quick-add */}
                <Tile style={{ marginBottom: "1rem" }}>
                  <div className={styles.attendancepage__visitor}>
                    <TextInput
                      id="visitor-name"
                      labelText="Visitor Name"
                      placeholder="Enter name"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                    />
                    <TextInput
                      id="visitor-phone"
                      labelText="Phone"
                      placeholder="Phone number"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                    />
                    <TextInput
                      id="visitor-email"
                      labelText="Email"
                      placeholder="Email (optional)"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                    />
                    <TextInput
                      id="visitor-notes"
                      labelText="Notes"
                      placeholder="Notes"
                      value={visitorNotes}
                      onChange={(e) => setVisitorNotes(e.target.value)}
                    />
                    <Button
                      kind="secondary"
                      size="sm"
                      onClick={handleAddVisitor}
                      disabled={!visitorName.trim() || !visitorPhone.trim()}
                    >
                      Add Visitor
                    </Button>
                  </div>
                  {visitors.length > 0 && (
                    <div className={styles.attendancepage__visitorlist}>
                      <p className={styles.attendancepage__visitorlistlabel}>
                        Visitors added ({visitors.length}):
                      </p>
                      {visitors.map((v, i) => (
                        <div
                          key={i}
                          className={styles.attendancepage__visitoritem}
                        >
                          <span>
                            {v.name} — {v.phone}
                          </span>
                          <Button
                            kind="ghost"
                            size="sm"
                            hasIconOnly
                            renderIcon={Police}
                            iconDescription="Remove"
                            onClick={() => handleRemoveVisitor(i)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Tile>

                <StatCards session={liveSession} />

                {membersLoading ? (
                  <DataTableSkeleton columnCount={5} rowCount={8} />
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

              {/* ── Tab 2: History ─────────────────────── */}
              <TabPanel>
                <div style={{ marginTop: "1.5rem" }}>
                  <SessionHistoryTable
                    sessions={sessions}
                    isLoading={sessionsLoading}
                  />
                </div>
              </TabPanel>

              {/* ── Tab 3: Visitors ────────────────────── */}
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

      {/* ── Follow-up candidates modal ──────────────────────── */}
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

      {/* ── Visitor follow-up update modal ──────────────────── */}
      <Modal
        open={visitorFollowUpModalOpen}
        modalHeading={`Follow-Up: ${selectedVisitor?.name ?? ""}`}
        primaryButtonText="Update"
        secondaryButtonText="Cancel"
        onRequestClose={() => {
          setVisitorFollowUpModalOpen(false);
          setSelectedVisitor(null);
        }}
        onRequestSubmit={async () => {
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
        }}
      >
        <p>Update follow-up status for {selectedVisitor?.name}.</p>
        <Select
          id="visitor-followup-status"
          labelText="Follow-Up Status"
          value={selectedVisitor?.followUpStatus ?? "pending"}
          onChange={(e) => {
            if (selectedVisitor) {
              setSelectedVisitor({
                ...selectedVisitor,
                followUpStatus: e.target.value as any,
              });
            }
          }}
        >
          <SelectItem value="pending" text="Pending" />
          <SelectItem value="contacted" text="Contacted" />
          <SelectItem value="converted" text="Converted" />
          <SelectItem value="no_interest" text="No Interest" />
        </Select>
      </Modal>
    </div>
  );
};

export default AttendancePage;
