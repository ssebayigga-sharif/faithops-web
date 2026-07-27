import {
  Button,
  Column,
  Grid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
} from "@carbon/react";
import {
  ChartBar,
  Finance,
  Renew,
  ReportData,
  Time,
} from "@carbon/icons-react";

import { useGiving } from "../useGiving";
import { GivingForm } from "../components/GivingForm";
import { GivingReview } from "../components/GivingReview";
import { GivingReceipt } from "../components/GivingReceipt";
import { GivingHistory } from "../components/GivingHistory";
import { GivingSummary } from "../components/GivingSummary";
import { GivingReports } from "../components/GivingReports";
import { MemberStatement } from "../components/MemberStatement";
import { StepIndicator } from "../components/StepIndicator";
import { GivingSidebar } from "../components/GivingSidebar";
import {
  colors,
  flexBetween,
  pageInner,
  pageShell,
  pageSubtitle,
  pageTitle,
} from "../components/givingStyles";

type GivingTabId = "record" | "history" | "summary" | "reports";

export default function GivingPage() {
  const giving = useGiving();

  const {
    isAdmin,
    step,
    setStep,
    form,
    setField,
    setEntryAmount,
    applySuggestedTithe,
    parsedEntries,
    totalAmount,
    totalTithe,
    totalOfferings,
    isValid,
    submitRecord,
    resetForm,
    submittedRecord,
    history,
    activeTab,
    setActiveTab,
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
    memberStatementName,
    setMemberStatementName,
    memberStatement,
    memberStatementTotal,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    dateFromFilter,
    setDateFromFilter,
    dateToFilter,
    setDateToFilter,
    filteredHistory,
  } = giving;

  const availableTabs: readonly GivingTabId[] = isAdmin
    ? ["record", "history", "summary", "reports"]
    : ["record", "history"];

  const tabIndex = Math.max(0, availableTabs.indexOf(activeTab));

  return (
    <main className="giving-page" style={pageShell}>
      <div className="giving-page__inner" style={pageInner}>
        <header style={{ ...flexBetween, marginBottom: "1.25rem" }}>
          <div>
            <h1 style={pageTitle}>Tithe & Offerings</h1>
            <p style={pageSubtitle}>
              Kabulengwa SDA Church · Faithful stewardship of God's blessings
            </p>
          </div>
          {step === "receipt" && (
            <Button kind="ghost" renderIcon={Renew} onClick={resetForm}>
              New record
            </Button>
          )}
        </header>

        <Tabs
          selectedIndex={tabIndex}
          onChange={({ selectedIndex }) => {
            const tab = availableTabs[selectedIndex];
            if (tab) setActiveTab(tab);
          }}
        >
          <TabList
            aria-label="Giving page sections"
            style={{ overflowX: "auto" }}
          >
            {availableTabs.map((tab) => {
              if (tab === "record")
                return (
                  <Tab key="record" renderIcon={Finance}>
                    Record giving
                  </Tab>
                );
              if (tab === "history")
                return (
                  <Tab key="history" renderIcon={Time}>
                    History
                    {history.length > 0 && (
                      <Tag
                        type="blue"
                        size="sm"
                        style={{ marginLeft: "0.35rem" }}
                      >
                        {history.length}
                      </Tag>
                    )}
                  </Tab>
                );
              if (tab === "summary")
                return (
                  <Tab key="summary" renderIcon={ChartBar}>
                    Summary
                  </Tab>
                );
              if (tab === "reports")
                return (
                  <Tab key="reports" renderIcon={ReportData}>
                    Reports
                  </Tab>
                );
              return null;
            })}
          </TabList>

          <TabPanels>
            {availableTabs.includes("record") && (
              <TabPanel>
                <Grid fullWidth>
                  <Column sm={4} md={8} lg={12}>
                    <Stack gap={5}>
                      {step !== "receipt" && <StepIndicator current={step} />}
                      {step === "entry" && (
                        <GivingForm
                          form={form}
                          totalAmount={totalAmount}
                          totalTithe={totalTithe}
                          totalOfferings={totalOfferings}
                          isValid={isValid}
                          isAdmin={isAdmin}
                          onSetField={setField}
                          onSetEntryAmount={setEntryAmount}
                          onApplySuggestedTithe={applySuggestedTithe}
                          onReview={() => setStep("review")}
                        />
                      )}
                      {step === "review" && (
                        <GivingReview
                          form={form}
                          entries={parsedEntries}
                          totalAmount={totalAmount}
                          onBack={() => setStep("entry")}
                          onSubmit={submitRecord}
                        />
                      )}
                      {step === "receipt" && submittedRecord && (
                        <GivingReceipt
                          record={submittedRecord}
                          onNewRecord={resetForm}
                        />
                      )}
                    </Stack>
                  </Column>
                  {step === "entry" && (
                    <Column sm={0} md={0} lg={4}>
                      <GivingSidebar
                        totalAmount={totalAmount}
                        totalTithe={totalTithe}
                        totalOfferings={totalOfferings}
                      />
                    </Column>
                  )}
                </Grid>
              </TabPanel>
            )}

            {availableTabs.includes("history") && (
              <TabPanel>
                <GivingHistory
                  records={filteredHistory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  dateFromFilter={dateFromFilter}
                  onDateFromChange={setDateFromFilter}
                  dateToFilter={dateToFilter}
                  onDateToChange={setDateToFilter}
                />
              </TabPanel>
            )}

            {isAdmin && (
              <TabPanel>
                <GivingSummary
                  records={history}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  availableMonths={availableMonths}
                />
              </TabPanel>
            )}

            {isAdmin && (
              <TabPanel>
                <Stack gap={6}>
                  <GivingReports
                    records={history}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    selectedMonth={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    reportFromDate={reportFromDate}
                    onFromDateChange={setReportFromDate}
                    reportToDate={reportToDate}
                    onToDateChange={setReportToDate}
                    activeReportTab={activeReportTab}
                    onReportTabChange={setActiveReportTab}
                    availableYears={availableYears}
                    availableMonths={availableMonths}
                  />
                  <hr
                    style={{
                      border: "none",
                      borderTop: `1px solid ${colors.border}`,
                      margin: "0.5rem 0",
                    }}
                  />
                  <MemberStatement
                    memberName={memberStatementName}
                    onMemberNameChange={setMemberStatementName}
                    records={memberStatement}
                    totalAmount={memberStatementTotal}
                  />
                </Stack>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </div>
    </main>
  );
}
