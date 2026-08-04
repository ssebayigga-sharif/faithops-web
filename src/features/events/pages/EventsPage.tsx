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
  TableSelectAll,
  TableSelectRow,
  Tag,
} from "@carbon/react";
import { Add, Edit, Reset, TrashCan } from "@carbon/icons-react";
import type { ChurchEvent, EventFormDraft } from "../types";
import { DEFAULT_EVENT_DRAFT } from "../data/eventData";
import { formatEventDate, sortEventsByStart } from "../eventUtils";
import {
  useCreateEvent,
  useDeleteEvent,
  useEvents,
  usePatchEvent,
} from "../hooks/useEvent";
import { EventFormDrawer } from "../components/EventFormDrawer";
import {
  createEventFromDraft,
  createEventPatchFromDraft,
  eventToFormDraft,
} from "../services/eventFactory";
import styles from "./EventsPage.module.scss";

const EVENT_LIST_HEADERS = [
  { key: "title", header: "Event" },
  { key: "date", header: "Date" },
  { key: "venue", header: "Venue" },
  { key: "organizer", header: "Organiser" },
  { key: "speaker", header: "Speaker" },
  { key: "status", header: "Status" },
  { key: "actions", header: "" },
];

function getEventRowId(event: ChurchEvent): string {
  return event._firebaseKey ?? event.id;
}

function isPersistedEvent(
  event: ChurchEvent | undefined,
): event is ChurchEvent & { _firebaseKey: string } {
  return Boolean(event?._firebaseKey && event._firebaseKey !== "__optimistic__");
}

function getEventDisplayStatus(event: ChurchEvent): string {
  if (!isPersistedEvent(event)) return "Saving";
  if (new Date(event.end).getTime() < Date.now()) return "Completed";
  return event.status === "Approved" ? "Upcoming" : event.status;
}

function getStatusTagType(status: string) {
  if (status === "Upcoming") return "green";
  if (status === "Completed") return "blue";
  if (status === "Saving") return "gray";
  if (status === "Needs volunteers") return "purple";
  if (status === "Pending approval") return "teal";
  return "gray";
}

export default function EventsPage() {
  const { events, isLoading, isError, error } = useEvents();
  const { createEvent, isCreating, createError } = useCreateEvent();
  const patchEvent = usePatchEvent();
  const deleteEvent = useDeleteEvent();
  const [draft, setDraft] = useState<EventFormDraft>(DEFAULT_EVENT_DRAFT);
  const [editDraft, setEditDraft] =
    useState<EventFormDraft>(DEFAULT_EVENT_DRAFT);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
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

  const pagedEventByRowId = useMemo(
    () => new Map(pagedEvents.map((event) => [getEventRowId(event), event])),
    [pagedEvents],
  );

  function updateDraft<Key extends keyof EventFormDraft>(
    field: Key,
    value: EventFormDraft[Key],
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateEditDraft<Key extends keyof EventFormDraft>(
    field: Key,
    value: EventFormDraft[Key],
  ) {
    setEditDraft((current) => ({
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

  function handleStartEdit(event: ChurchEvent) {
    if (!isPersistedEvent(event)) {
      setNotice({
        kind: "error",
        title: "Event still saving",
        subtitle: "Wait for Firebase to finish saving before editing it.",
      });
      return;
    }

    setEditingEvent(event);
    setEditDraft(eventToFormDraft(event));
  }

  async function handleUpdateEvent() {
    if (!editingEvent || !isPersistedEvent(editingEvent)) {
      setNotice({
        kind: "error",
        title: "Event update unavailable",
        subtitle: "This event is missing its Firebase key.",
      });
      return;
    }

    try {
      await patchEvent.mutateAsync({
        firebaseKey: editingEvent._firebaseKey,
        partial: createEventPatchFromDraft(editDraft, editingEvent),
      });

      setEditingEvent(null);
      setEditDraft(DEFAULT_EVENT_DRAFT);
      setNotice({
        kind: "success",
        title: "Event updated",
        subtitle: `${editDraft.title || editingEvent.title} was updated on the events page.`,
      });
    } catch (err) {
      setNotice({
        kind: "error",
        title: "Event update failed",
        subtitle:
          err instanceof Error
            ? err.message
            : "Could not update this event. Check Firebase rules and your network connection.",
      });
    }
  }

  async function handleDeleteEvent(event: ChurchEvent) {
    if (!isPersistedEvent(event)) {
      setNotice({
        kind: "error",
        title: "Event still saving",
        subtitle: "Wait for Firebase to finish saving before deleting it.",
      });
      return;
    }

    if (!window.confirm(`Delete "${event.title}" from the events page?`)) {
      return;
    }

    try {
      await deleteEvent.mutateAsync(event._firebaseKey);
      setNotice({
        kind: "success",
        title: "Event deleted",
        subtitle: `${event.title} was removed from the events page.`,
      });
    } catch (err) {
      setNotice({
        kind: "error",
        title: "Event delete failed",
        subtitle:
          err instanceof Error
            ? err.message
            : "Could not delete this event. Check Firebase rules and your network connection.",
      });
    }
  }

  async function handleDeleteSelected(rowIds: string[]) {
    const selectedEvents = rowIds
      .map((rowId) => pagedEventByRowId.get(rowId))
      .filter(isPersistedEvent);

    if (!selectedEvents.length) {
      setNotice({
        kind: "error",
        title: "No saved events selected",
        subtitle: "Only events already saved in Firebase can be deleted.",
      });
      return;
    }

    if (!window.confirm(`Delete ${selectedEvents.length} selected event(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedEvents.map((event) =>
          deleteEvent.mutateAsync(event._firebaseKey),
        ),
      );
      setNotice({
        kind: "success",
        title: "Selected events deleted",
        subtitle: `${selectedEvents.length} event(s) were removed from the events page.`,
      });
    } catch (err) {
      setNotice({
        kind: "error",
        title: "Selected delete failed",
        subtitle:
          err instanceof Error
            ? err.message
            : "Could not delete the selected events. Check Firebase rules and your network connection.",
      });
    }
  }

  const rows = pagedEvents.map((event) => ({
    id: getEventRowId(event),
    title: event.title,
    date: formatEventDate(event.start),
    venue: event.venue,
    organizer: event.organizer ?? "Church office",
    speaker: event.speaker,
    status: getEventDisplayStatus(event),
    actions: "",
  }));

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
                getSelectionProps,
                selectedRows,
              }) => (
                <TableContainer className={styles.tableContainer}>
                  {selectedRows.length > 0 && (
                    <div className={styles.selectionActions}>
                      <span>{selectedRows.length} selected</span>
                      <Button
                        kind="danger--ghost"
                        size="sm"
                        renderIcon={TrashCan}
                        onClick={() =>
                          handleDeleteSelected(
                            selectedRows.map((row) => row.id),
                          )
                        }
                      >
                        Delete selected
                      </Button>
                    </div>
                  )}

                  <Table {...getTableProps()} size="md">
                    <TableHead>
                      <TableRow>
                        <TableSelectAll {...getSelectionProps()} />
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
                        const rawEvent = pagedEventByRowId.get(row.id);
                        const selectionProps = getSelectionProps({ row });
                        const canManage = isPersistedEvent(rawEvent);

                        return (
                          <TableRow
                            {...getRowProps({ row })}
                            key={row.id}
                            className="event-table__row"
                          >
                            <TableSelectRow
                              {...selectionProps}
                              onSelect={(
                                event: React.MouseEvent<HTMLInputElement>,
                              ) => {
                                event.stopPropagation();
                                selectionProps.onSelect(event);
                              }}
                            />

                            {row.cells.map((cell) => {
                              if (cell.info.header === "title") {
                                return (
                                  <TableCell key={cell.id}>
                                    <div className="event-table__title">
                                      {cell.value as string}
                                    </div>
                                    {rawEvent?.description && (
                                      <div className="event-table__meta">
                                        {rawEvent.description}
                                      </div>
                                    )}
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
                                return (
                                  <TableCell key={cell.id}>
                                    <Tag
                                      type={getStatusTagType(status)}
                                      size="sm"
                                    >
                                      {status}
                                    </Tag>
                                  </TableCell>
                                );
                              }

                              if (cell.info.header === "actions") {
                                return (
                                  <TableCell
                                    key={cell.id}
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <div className={styles.rowActions}>
                                      <Button
                                        kind="ghost"
                                        size="sm"
                                        hasIconOnly
                                        renderIcon={Edit}
                                        iconDescription="Edit event"
                                        disabled={!canManage}
                                        onClick={() =>
                                          rawEvent && handleStartEdit(rawEvent)
                                        }
                                      />
                                      <Button
                                        kind="ghost"
                                        size="sm"
                                        hasIconOnly
                                        renderIcon={TrashCan}
                                        iconDescription="Delete event"
                                        disabled={!canManage}
                                        onClick={() =>
                                          rawEvent && handleDeleteEvent(rawEvent)
                                        }
                                      />
                                    </div>
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

      <EventFormDrawer
        open={Boolean(editingEvent)}
        draft={editDraft}
        isSubmitting={patchEvent.isPending}
        title="Edit Event"
        description="Update the selected event details."
        submitLabel="Save changes"
        submittingLabel="Saving..."
        onChange={updateEditDraft}
        onClose={() => {
          setEditingEvent(null);
          setEditDraft(DEFAULT_EVENT_DRAFT);
        }}
        onSubmit={handleUpdateEvent}
      />
    </Stack>
  );
}
