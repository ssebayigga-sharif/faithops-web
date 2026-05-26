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
} from "@carbon/react";
import { EventSchedule, List } from "@carbon/icons-react";

import { StatCards } from "./statCards";
import { MarkAttendanceTable } from "./MarkAttendanceTable";
import { SessionHistoryTable } from "./sessionTableHistory";
import {
  useMembers,
  useSessions,
  useBulkSaveAttendance,
} from "./useAttendance";
import type {
  AttendanceRow,
  AttendanceStatus,
  ServiceType,
} from "./attendance";

import styles from "./attendance.module.scss";

const SERVICE_TYPES: ServiceType[] = [
  "Sabbath Programmes",
  "Wednesday Fellowship",
  "Prayer and Fasting",
  "Friday Prayer",
  "Special Event",
];

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const todayIso = toIso(new Date());

export const AttendancePage: React.FC = () => {
  // ── Session config ────────────────────────────────────────
  const [date, setDate] = useState(todayIso);
  const [serviceType, setServiceType] =
    useState<ServiceType>("Sabbath Programmes");
  const [markedBy, setMarkedBy] = useState("");

  // ── Members → rows ────────────────────────────────────────
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();

  // Build editable rows from members list
  const [rows, setRows] = useState<AttendanceRow[]>([]);

  // Sync rows when members load (only initialise once)
  React.useEffect(() => {
    if (members.length && rows.length === 0) {
      setRows(
        members
          .filter((m) => m.membershipStatus === "active")
          .map((m) => ({
            memberId: m.uid,
            memberName: `${m.firstName} ${m.lastName}`,
            department: m.department ?? "",
            status: "absent" as AttendanceStatus,
            notes: "",
          })),
      );
    }
  }, [members, rows.length]);

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

  // ── Save ──────────────────────────────────────────────────
  const saveMutation = useBulkSaveAttendance();

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      date,
      serviceType,
      rows,
      markedBy: markedBy || "Admin",
    });
    // Reset row notes after save; keep statuses
    setRows((prev) => prev.map((r) => ({ ...r, notes: "" })));
  };

  // Derive live stat card from current rows (before save)
  const liveSession = {
    id: "",
    date,
    serviceType,
    totalPresent: rows.filter((r) => r.status === "present").length,
    totalAbsent: rows.filter((r) => r.status === "absent").length,
    totalLate: rows.filter((r) => r.status === "late").length,
    totalExcused: rows.filter((r) => r.status === "excused").length,
    createdAt: "",
  };

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
                  Record and review member attendance across all services
                </p>
              </div>
            </div>
          </Column>
        </Grid>
      </div>

      <Grid>
        <Column lg={16} md={8} sm={4}>
          {/* ── Save feedback ───────────────────────────── */}
          {saveMutation.isSuccess && (
            <InlineNotification
              kind="success"
              lowContrast
              title="Attendance saved successfully"
              style={{ marginBottom: "1rem" }}
              onCloseButtonClick={() => saveMutation.reset()}
            />
          )}
          {saveMutation.isError && (
            <InlineNotification
              kind="error"
              lowContrast
              title="Failed to save: "
              subtitle={(saveMutation.error as Error)?.message}
              style={{ marginBottom: "1rem" }}
              onCloseButtonClick={() => saveMutation.reset()}
            />
          )}

          {/* ── Tabs ────────────────────────────────────── */}
          <Tabs>
            <TabList aria-label="Attendance sections" contained>
              <Tab renderIcon={EventSchedule}>Mark Attendance</Tab>
              <Tab renderIcon={List}>Session History</Tab>
            </TabList>

            <TabPanels>
              {/* ── Tab 1: Mark attendance ─────────────── */}
              <TabPanel>
                {/* Session config tile */}
                <Tile style={{ marginBottom: "1.5rem", marginTop: "1.5rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "1.25rem",
                    }}
                  >
                    <DatePicker
                      datePickerType="single"
                      value={date}
                      onChange={([d]) => d && setDate(toIso(d))}
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

                {/* Live stat cards */}
                <StatCards session={rows.length > 0 ? liveSession : null} />

                {/* Mark table */}
                {membersLoading ? (
                  <DataTableSkeleton columnCount={4} rowCount={8} />
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
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>
    </div>
  );
};

export default AttendancePage;
