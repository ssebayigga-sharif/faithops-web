import {
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
  ProgressBar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  Tag,
  Tile,
} from "@carbon/react";
import type { ChurchEvent, EventManagementTableProps } from "@/churchTypes/eventTypes";
import {
  formatEventDate,
  formatEventTime,
  getAttendanceRate,
  getVolunteerParticipationRate,
} from "../eventUtils";

const HEADERS = [
  { key: "title", header: "Event" },
  { key: "category", header: "Category" },
  { key: "date", header: "Date" },
  { key: "venue", header: "Venue" },
  { key: "attendance", header: "Attendance" },
  { key: "volunteers", header: "Volunteers" },
  { key: "status", header: "Status" },
  { key: "actions", header: "" },
];

function getStatusTagType(
  status: ChurchEvent["status"],
): "green" | "blue" | "cyan" | "gray" | "red" | "purple" | "magenta" {
  if (status === "Approved") return "green";
  if (status === "Pending approval") return "purple";
  if (status === "Needs volunteers") return "magenta";
  if (status === "Completed") return "blue";
  return "gray";
}

export function EventManagementTable({
  events,
  onSelectEvent,
}: EventManagementTableProps) {
  const rows = events.map((event) => ({
    id: event.id,
    title: event.title,
    category: event.category,
    date: event.start,
    venue: event.venue,
    attendance: getAttendanceRate(event),
    volunteers: getVolunteerParticipationRate(event),
    status: event.status,
    actions: "",
    _raw: event,
  }));

  return (
    <Tile className="event-management-table">
      <Stack gap={5}>
        <Stack className="event-section__header" orientation="horizontal" gap={5}>
          <Stack gap={2}>
            <h2>Event Management Table</h2>
            <p>Operational controls for approvals, attendance, volunteers, and reporting.</p>
          </Stack>
          <Tag type="blue" size="sm">
            {events.length} events
          </Tag>
        </Stack>

        <DataTable rows={rows} headers={HEADERS} isSortable>
          {({
            rows: tableRows,
            headers,
            getTableProps,
            getHeaderProps,
            getRowProps,
          }) => (
            <TableContainer>
              <TableToolbar>
                <TableToolbarContent />
              </TableToolbar>

              <Table {...getTableProps()} size="md">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row) => {
                    const raw = rows.find((event) => event.id === row.id)?._raw;

                    return (
                      <TableRow
                        {...getRowProps({ row })}
                        key={row.id}
                        onClick={() => raw && onSelectEvent(raw)}
                        style={{ cursor: "pointer" }}
                      >
                        {row.cells.map((cell) => {
                          if (cell.info.header === "title") {
                            return (
                              <TableCell key={cell.id}>
                                <Stack gap={1}>
                                  <strong className="event-table__title">
                                    {cell.value as string}
                                  </strong>
                                  <span className="event-table__meta">
                                    {raw?.department} · {raw?.speaker}
                                  </span>
                                </Stack>
                              </TableCell>
                            );
                          }

                          if (cell.info.header === "category") {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type="cyan" size="sm">
                                  {cell.value as string}
                                </Tag>
                              </TableCell>
                            );
                          }

                          if (cell.info.header === "date") {
                            return (
                              <TableCell key={cell.id}>
                                <Stack gap={1}>
                                  <span>{formatEventDate(cell.value as string)}</span>
                                  <span className="event-table__meta">
                                    {formatEventTime(cell.value as string)}
                                  </span>
                                </Stack>
                              </TableCell>
                            );
                          }

                          if (cell.info.header === "attendance") {
                            const percent = cell.value as number;
                            return (
                              <TableCell key={cell.id}>
                                <ProgressBar
                                  hideLabel
                                  label="Attendance"
                                  max={100}
                                  size="small"
                                  status={percent < 40 ? "active" : "finished"}
                                  value={percent}
                                />
                              </TableCell>
                            );
                          }

                          if (cell.info.header === "volunteers") {
                            const percent = cell.value as number;
                            return (
                              <TableCell key={cell.id}>
                                <ProgressBar
                                  hideLabel
                                  label="Volunteer coverage"
                                  max={100}
                                  size="small"
                                  status={percent < 70 ? "error" : "finished"}
                                  value={percent}
                                />
                              </TableCell>
                            );
                          }

                          if (cell.info.header === "status") {
                            return (
                              <TableCell key={cell.id}>
                                <Tag
                                  type={getStatusTagType(cell.value as ChurchEvent["status"])}
                                  size="sm"
                                >
                                  {cell.value as string}
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
                                <OverflowMenu size="sm" flipped>
                                  <OverflowMenuItem
                                    itemText="Open details"
                                    onClick={() => raw && onSelectEvent(raw)}
                                  />
                                  <OverflowMenuItem itemText="Mark attendance" />
                                  <OverflowMenuItem itemText="Volunteer check-in" />
                                  <OverflowMenuItem itemText="Send announcement" />
                                  <OverflowMenuItem itemText="Approve event" />
                                  <OverflowMenuItem itemText="Archive report" hasDivider />
                                </OverflowMenu>
                              </TableCell>
                            );
                          }

                          return <TableCell key={cell.id}>{cell.value as string}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Stack>
    </Tile>
  );
}
