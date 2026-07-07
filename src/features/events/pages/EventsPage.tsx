import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Column,
  DataTable,
  Grid,
  InlineNotification,
  Pagination,
  Search,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from "@carbon/react";
import { Add, Download, Renew, Reset } from "@carbon/icons-react";
import type { ChurchEvent, EventFormDraft } from "@/features/events/types";
import { DEFAULT_EVENT_DRAFT } from "../data/eventData";
import { formatEventDate, sortEventsByStart } from "../eventUtils";
import { useCreateEvent, useEvents } from "@/features/events/hooks/useEvent";
import { EventDetailsDrawer } from "../components/EventDetailsDrawer";
import { EventFormDrawer } from "../components/EventFormDrawer";
import { createEventFromDraft } from "../services/eventFactory";
import styles from "./EventsPage.module.scss";

const EVENT_LIST_HEADERS = [
  { key: "title", header: "Event" },
  { key: "date", header: "Date" },
  { key: "venue", header: "Venue" },
  { key: "status", header: "Status" },
];

export default function EventsPage() {
  const { events, isLoading, isError, error, refetch } = useEvents();
  const { createEvent, isCreating, createError } = useCreateEvent();
  const [draft, setDraft] = useState<EventFormDraft>(DEFAULT_EVENT_DRAFT);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "success" | "error";
    title: string;
    subtitle: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const orderedEvents = useMemo(() => sortEventsByStart(events), [events]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orderedEvents;
    return orderedEvents.filter((event) => {
      const searchFields = [
        event.title,
        event.venue,
        event.department,
        event.category,
        event.speaker,
        event.start,
        event.end,
      ]
        .join(" ")
        .toLowerCase();

      return searchFields.includes(q);
    });
  }, [orderedEvents, searchQuery]);

  useEffect(() => {
    if (filteredEvents.length === 0) {
      setCurrentPage(1);
      return;
    }

    const lastPage = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  }, [currentPage, filteredEvents.length, pageSize]);

  const pagedEvents = useMemo(() => {
    const safePage = Math.min(
      Math.max(currentPage, 1),
      Math.max(1, Math.ceil(filteredEvents.length / pageSize) || 1),
    );
    const start = (safePage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  function updateDraft<Key extends keyof EventFormDraft>(
    field: Key,
    value: EventFormDraft[Key],
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  async function handleCreateEvent() {
    const nextEvent = createEventFromDraft(draft);

    try {
      const savedEvent = await createEvent(nextEvent);

      setSelectedEvent(savedEvent);
      setDraft(DEFAULT_EVENT_DRAFT);
      setIsCreateOpen(false);
      setNotice({
        kind: "success",
        title: "Event created",
        subtitle: `${savedEvent.title} was saved to the calendar. Members will be notified shortly.`,
      });
    } catch {
      setNotice({
        kind: "error",
        title: "Event save failed",
        subtitle:
          createError ??
          "Could not save this event. Check Firebase rules and your network connection.",
      });
    }
  }

  const rows = pagedEvents.map((event) => ({
    id: event.id,
    title: event.title,
    date: formatEventDate(event.start),
    venue: event.venue,
    status:
      new Date(event.end).getTime() < Date.now() ? "Completed" : "Upcoming",
    _raw: event,
  }));

  const rowLookup = useMemo(
    () => new Map(rows.map((row) => [row.id, row])),
    [rows],
  );

  return (
    <Stack className={`${styles.page} admin-page events-page`} gap={5}>
      <Stack className={`${styles.inner} admin-page__inner`} gap={5}>
        <Stack
          as="header"
          className={`${styles.header} admin-page__header`}
          orientation="horizontal"
          gap={5}
        >
          <Stack gap={2}>
            <h1 className="admin-page__title">SDA Events Operations</h1>
            <p className="admin-page__subtitle">
              Upcoming church events and programs.
            </p>
          </Stack>

          <Stack
            className={`${styles.headerActions} admin-actions`}
            orientation="horizontal"
            gap={3}
          >
            <Button
              kind="ghost"
              renderIcon={Renew}
              size="md"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button kind="secondary" renderIcon={Download} size="md">
              Download
            </Button>
            <Button
              kind="primary"
              renderIcon={Add}
              size="md"
              onClick={() => setIsCreateOpen(true)}
            >
              Create Event
            </Button>
          </Stack>
        </Stack>

        {notice && (
          <InlineNotification
            kind={notice.kind}
            title={notice.title}
            subtitle={notice.subtitle}
            lowContrast
            onCloseButtonClick={() => setNotice(null)}
          />
        )}

        {isError && (
          <InlineNotification
            kind="error"
            title="Events failed to load"
            subtitle={
              error ?? "Check Firebase rules and your network connection."
            }
            lowContrast
          />
        )}

        {!isLoading && !isError && events.length === 0 && (
          <InlineNotification
            kind="info"
            title="No events in Firebase yet"
            subtitle="Create the first SDA event and it will be stored under the /events collection."
            lowContrast
          />
        )}

        <Grid fullWidth withRowGap>
          <Column sm={4} md={8} lg={16}>
            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <Search
                  id="event-search"
                  labelText="Search events"
                  placeholder="Search by name, venue, or date…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  size="md"
                />
              </div>
              {searchQuery && (
                <Button
                  kind="ghost"
                  renderIcon={Reset}
                  size="md"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  Reset
                </Button>
              )}
            </div>

            <DataTable rows={rows} headers={EVENT_LIST_HEADERS} isSortable>
              {({
                rows: tableRows,
                headers,
                getTableProps,
                getHeaderProps,
                getRowProps,
              }) => (
                <TableContainer className={styles.tableContainer}>
                  <Table {...getTableProps()} size="md">
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader
                            {...getHeaderProps({ header })}
                            key={header.key}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableRows.map((row) => {
                        const raw = row.id
                          ? rowLookup.get(row.id)?._raw
                          : undefined;

                        return (
                          <TableRow
                            {...getRowProps({ row })}
                            key={row.id}
                            className="event-table__row"
                            onClick={() => raw && setSelectedEvent(raw)}
                          >
                            {row.cells.map((cell) => {
                              if (cell.info.header === "title") {
                                return (
                                  <TableCell key={cell.id}>
                                    <strong>{cell.value as string}</strong>
                                  </TableCell>
                                );
                              }

                              if (cell.info.header === "date") {
                                return (
                                  <TableCell key={cell.id}>
                                    <Tag type="blue" size="sm">
                                      {cell.value as string}
                                    </Tag>
                                  </TableCell>
                                );
                              }

                              if (cell.info.header === "status") {
                                const status = cell.value as string;
                                const statusType =
                                  status === "Upcoming" ? "green" : "blue";
                                return (
                                  <TableCell key={cell.id}>
                                    <Tag type={statusType} size="sm">
                                      {status}
                                    </Tag>
                                  </TableCell>
                                );
                              }

                              return (
                                <TableCell key={cell.id}>
                                  {cell.value as string}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <Pagination
                    className={styles.pagination}
                    totalItems={filteredEvents.length}
                    pageSize={pageSize}
                    pageSizes={[10, 25, 50, 100]}
                    page={currentPage}
                    onChange={({ page, pageSize: ps }) => {
                      setCurrentPage(page);
                      setPageSize(ps);
                    }}
                  />
                </TableContainer>
              )}
            </DataTable>
          </Column>
        </Grid>
      </Stack>

      <EventFormDrawer
        open={isCreateOpen}
        draft={draft}
        isSubmitting={isCreating}
        onChange={updateDraft}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <EventDetailsDrawer
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </Stack>
  );
}
