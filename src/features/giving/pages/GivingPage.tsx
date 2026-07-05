import {
  Breadcrumb,
  BreadcrumbItem,
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
  Tile,
} from "@carbon/react";
import {
  ChartBar,
  DocumentPdf,
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
import { formatUGX } from "../givingUtils";
import {
  colors,
  flexBetween,
  flexRowWrap,
  pageInner,
  pageShell,
  pageSubtitle,
  pageTitle,
  sectionDesc,
  tileSection,
} from "../components/givingStyles";
import { StepNumber } from "../components/givingUi";

const STEPS = ["Entry", "Review", "Receipt"] as const;

type GivingTabId = "record" | "history" | "summary" | "reports";

const STEP_MAP: Record<string, number> = {
  entry: 0,
  review: 1,
  receipt: 2,
};

function StepIndicator({ current }: { current: string }) {
  const currentIndex = STEP_MAP[current] ?? 0;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0",
        overflowX: "auto",
      }}
      aria-label="Progress steps"
    >
      {STEPS.map((step, i) => (
        <div
          key={step}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <StepNumber index={i} currentIndex={currentIndex} />
          <span
            style={{
              fontSize: "13px",
              fontWeight: i === currentIndex ? 600 : 400,
              color: i === currentIndex ? colors.text : colors.textMuted,
            }}
          >
            {step}
          </span>
          {i < STEPS.length - 1 && (
            <span
              aria-hidden
              style={{
                width: "2rem",
                height: 1,
                background: colors.border,
                margin: "0 0.25rem",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

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
        <header
          style={{
            ...flexBetween,
            marginBottom: "1.25rem",
          }}
        >
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
        // @ts-ignore
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
              if (tab === "record") {
                return (
                  <Tab key="record" renderIcon={Finance}>
                    Record giving
                  </Tab>
                );
              }
              if (tab === "history") {
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
              }
              if (tab === "summary") {
                return (
                  <Tab key="summary" renderIcon={ChartBar}>
                    Summary
                  </Tab>
                );
              }
              if (tab === "reports") {
                return (
                  <Tab key="reports" renderIcon={ReportData}>
                    Reports
                  </Tab>
                );
              }
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
                        <Tile
                          style={{
                            ...tileSection,
                            borderLeft: `3px solid ${colors.interactive}`,
                          }}
                        >
                          <Stack orientation="horizontal" gap={4}>
                            <Finance
                              size={24}
                              style={{
                                color: colors.interactive,
                                flexShrink: 0,
                              }}
                            />
                            <Stack gap={1}>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "14px",
                                  color: colors.text,
                                  fontStyle: "italic",
                                }}
                              >
                                &ldquo;Bring the whole tithe into the
                                storehouse, that there may be food in my house.
                                Test me in this… and see if I will not throw
                                open the floodgates of heaven and pour out so
                                much blessing that there will not be room enough
                                to store it.&rdquo;
                              </p>
                              <p
                                style={{
                                  margin: "4px 0 0",
                                  fontSize: "12px",
                                  color: colors.textMuted,
                                }}
                              >
                                — Malachi 3:10 (NIV)
                              </p>
                            </Stack>
                          </Stack>
                        </Tile>
                      )}

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
                      <Stack gap={4}>
                        <Tile style={tileSection}>
                          <Stack gap={3}>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                            >
                              Giving Categories
                            </h4>
                            <Stack gap={3}>
                              {[
                                {
                                  title: "Tithe",
                                  desc: "10% of all income, returned to God — a recognition of His ownership.",
                                },
                                {
                                  title: "Offering",
                                  desc: "Freewill offering for local church operations and ministries.",
                                },
                                {
                                  title: "Building Fund",
                                  desc: "Contributions for maintaining and expanding the church sanctuary.",
                                },
                                {
                                  title: "Mission Fund",
                                  desc: "Supporting local and global evangelism efforts.",
                                },
                                {
                                  title: "Church lunch",
                                  desc: "Put in something for lunch .",
                                },
                              ].map((item) => (
                                <Stack key={item.title} gap={1}>
                                  <strong style={{ fontSize: "13px" }}>
                                    {item.title}
                                  </strong>
                                  <p style={sectionDesc}>{item.desc}</p>
                                </Stack>
                              ))}
                            </Stack>
                          </Stack>
                        </Tile>

                        <Tile
                          style={{
                            ...tileSection,
                            borderLeft: `3px solid ${colors.brand}`,
                          }}
                        >
                          <Stack gap={2}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                fontStyle: "italic",
                              }}
                            >
                              &ldquo;Each of you should give what you have
                              decided in your heart to give, not reluctantly or
                              under compulsion, for God loves a cheerful
                              giver.&rdquo;
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                color: colors.textMuted,
                              }}
                            >
                              — 2 Corinthians 9:7
                            </p>
                          </Stack>
                        </Tile>

                        {totalAmount > 0 && (
                          <Tile
                            style={{
                              ...tileSection,
                              borderLeft: `4px solid ${colors.interactive}`,
                            }}
                          >
                            <Stack gap={2}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: colors.textMuted,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                }}
                              >
                                Current total
                              </span>
                              <strong
                                style={{
                                  fontSize: "22px",
                                  color: colors.text,
                                }}
                              >
                                {formatUGX(totalAmount)}
                              </strong>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "12px",
                                  color: colors.textMuted,
                                }}
                              >
                                {totalTithe > 0 &&
                                  `${formatUGX(totalTithe)} tithe`}
                                {totalTithe > 0 && totalOfferings > 0 && " · "}
                                {totalOfferings > 0 &&
                                  `${formatUGX(totalOfferings)} offerings`}
                              </p>
                            </Stack>
                          </Tile>
                        )}
                      </Stack>
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
