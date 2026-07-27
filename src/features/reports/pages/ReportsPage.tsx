import React from "react";
import {
  Grid,
  Column,
  Tile,
  DataTableSkeleton,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Tag,
} from "@carbon/react";
import {
  Events,
  UserMultiple,
  Dashboard,
  Group,
  UserFollow,
} from "@carbon/icons-react";
import { useSessions } from "@/features/attendance/hooks/useAttendance";
import { useMembers } from "@/features/attendance/hooks/useAttendance";
import { useVisitors } from "@/features/attendance/hooks/useAttendance";
import { useFollowUpCandidates } from "@/features/attendance/hooks/useAttendance";
import { useReportStats } from "@/features/reports/components/ReportStats";

import styles from "./reports.module.scss";

export const ReportsPage: React.FC = () => {
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: visitors = [] } = useVisitors();
  const { data: followUpCandidates = [] } = useFollowUpCandidates();

  const isLoading = sessionsLoading || membersLoading;
  const stats = useReportStats(sessions, members, followUpCandidates, visitors);

  if (isLoading) {
    return (
      <div className={styles.reportspage}>
        <div className={styles.reportsheader}>
          <Grid>
            <Column lg={16} md={8} sm={4}>
              <h1 className={styles.reportsheader__title}>
                Centralized Reports
              </h1>
              <p className={styles.reportsheader__subtitle}>
                Loading report data...
              </p>
            </Column>
          </Grid>
        </div>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <DataTableSkeleton columnCount={4} rowCount={5} />
          </Column>
        </Grid>
      </div>
    );
  }

  return (
    <div className={styles.reportspage}>
      <div className={styles.reportsheader}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className={styles.reportsheader__inner}>
              <div>
                <h1 className={styles.reportsheader__title}>
                  Centralized Reports
                </h1>
                <p className={styles.reportsheader__subtitle}>
                  Attendance, membership, and engagement data in one place
                </p>
              </div>
              {stats && (
                <Tag type="blue" size="sm">
                  Updated live from Firebase
                </Tag>
              )}
            </div>
          </Column>
        </Grid>
      </div>

      {!stats ? (
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Tile>
              <p>
                No attendance sessions recorded yet. Start marking attendance to
                see reports.
              </p>
            </Tile>
          </Column>
        </Grid>
      ) : (
        <Grid>
          <Column lg={4} md={4} sm={4}>
            <Tile className={styles.reportspage__kpi}>
              <Dashboard size={24} />
              <span className={styles.reportspage__kpiValue}>
                {stats.totalSessions}
              </span>
              <span className={styles.reportspage__kpiLabel}>
                Total Sessions
              </span>
            </Tile>
          </Column>
          <Column lg={4} md={4} sm={4}>
            <Tile className={styles.reportspage__kpi}>
              <UserMultiple size={24} />
              <span className={styles.reportspage__kpiValue}>
                {stats.totalMembers}
              </span>
              <span className={styles.reportspage__kpiLabel}>
                Active Members
              </span>
            </Tile>
          </Column>
          <Column lg={4} md={4} sm={4}>
            <Tile className={styles.reportspage__kpi}>
              <Events size={24} />
              <span className={styles.reportspage__kpiValue}>
                {stats.averageAttendance}
              </span>
              <span className={styles.reportspage__kpiLabel}>
                Avg Attendance
              </span>
            </Tile>
          </Column>
          <Column lg={4} md={4} sm={4}>
            <Tile className={styles.reportspage__kpi}>
              <Group size={24} />
              <span className={styles.reportspage__kpiValue}>
                {stats.presentRate}%
              </span>
              <span className={styles.reportspage__kpiLabel}>
                Attendance Rate
              </span>
            </Tile>
          </Column>

          <Column lg={8} md={8} sm={4}>
            <div style={{ marginTop: "2rem" }}>
              <h2 className={styles.reportspage__sectionTitle}>
                Attendance by Service Type
              </h2>
              <TableContainer>
                <Table size="lg" useZebraStyles>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Service Type</TableHeader>
                      <TableHeader>Total Present</TableHeader>
                      <TableHeader>Total Members</TableHeader>
                      <TableHeader>Rate</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(stats.byService).map(([service, data]) => (
                      <TableRow key={service}>
                        <TableCell>
                          <Tag type="teal" size="sm">
                            {service}
                          </Tag>
                        </TableCell>
                        <TableCell>{data.present}</TableCell>
                        <TableCell>{data.total}</TableCell>
                        <TableCell>
                          {data.total
                            ? Math.round((data.present / data.total) * 100)
                            : 0}
                          %
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Column>

          <Column lg={8} md={8} sm={4}>
            <div style={{ marginTop: "2rem" }}>
              <h2 className={styles.reportspage__sectionTitle}>
                Monthly Trend
              </h2>
              <TableContainer>
                <Table size="lg" useZebraStyles>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Month</TableHeader>
                      <TableHeader>Present</TableHeader>
                      <TableHeader>Total</TableHeader>
                      <TableHeader>Rate</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.monthly.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          No monthly data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.monthly.map((m) => (
                        <TableRow key={m.month}>
                          <TableCell>
                            {new Date(m.month + "-01").toLocaleDateString(
                              "en-UG",
                              {
                                year: "numeric",
                                month: "long",
                              },
                            )}
                          </TableCell>
                          <TableCell>{m.present}</TableCell>
                          <TableCell>{m.total}</TableCell>
                          <TableCell>
                            <Tag
                              type={
                                m.rate >= 75
                                  ? "green"
                                  : m.rate >= 40
                                    ? "blue"
                                    : "red"
                              }
                              size="sm"
                            >
                              {m.rate}%
                            </Tag>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Column>

          <Column lg={16} md={8} sm={4}>
            <div style={{ marginTop: "2rem" }}>
              <Tile className={styles.reportspage__summary}>
                <h3>Summary</h3>
                <div className={styles.reportspage__summaryGrid}>
                  <div>
                    <span className={styles.reportspage__summaryLabel}>
                      Present Rate
                    </span>
                    <span className={styles.reportspage__summaryValue}>
                      {stats.presentRate}%
                    </span>
                  </div>
                  <div>
                    <span className={styles.reportspage__summaryLabel}>
                      Late Rate
                    </span>
                    <span className={styles.reportspage__summaryValue}>
                      {stats.lateRate}%
                    </span>
                  </div>
                  <div>
                    <span className={styles.reportspage__summaryLabel}>
                      Absent Rate
                    </span>
                    <span className={styles.reportspage__summaryValue}>
                      {stats.absentRate}%
                    </span>
                  </div>
                  <div>
                    <span className={styles.reportspage__summaryLabel}>
                      Total Visitors
                    </span>
                    <span className={styles.reportspage__summaryValue}>
                      {stats.totalVisitors}
                    </span>
                  </div>
                  <div>
                    <span className={styles.reportspage__summaryLabel}>
                      Follow-Up Needed
                    </span>
                    <span className={styles.reportspage__summaryValue}>
                      {stats.followUpNeeded}
                    </span>
                  </div>
                  <div>
                    <span className={styles.reportspage__summaryLabel}>
                      Average Attendance
                    </span>
                    <span className={styles.reportspage__summaryValue}>
                      {stats.averageAttendance}
                    </span>
                  </div>
                </div>
              </Tile>
            </div>
          </Column>
        </Grid>
      )}
    </div>
  );
};

export default ReportsPage;
