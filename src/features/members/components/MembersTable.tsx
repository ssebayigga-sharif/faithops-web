import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableSelectAll,
  TableSelectRow,
  TableBatchActions,
  TableBatchAction,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
} from "@carbon/react";
import { Email, UserFollow, TrashCan } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";

import type { Member, SortField } from "@/features/members/types";
import { formatDate } from "@/features/members/utils/memberUtils";

//  Table column definitions

const HEADERS = [
  { key: "fullName", header: "Member" },
  { key: "id", header: "ID" },
  { key: "ministries", header: "Ministry" },
  { key: "village", header: "Village" },
  { key: "joinedAt", header: "Joined" },
  { key: "actions", header: "" },
];

const AVATAR_PALETTE = ["#0f2d52", "#c6971a", "#198038", "#6929c4", "#9f1853"];

function avatarColor(id: string): string {
  const n = parseInt(id.replace(/\D/g, ""), 10) || 0;
  return AVATAR_PALETTE[n % AVATAR_PALETTE.length];
}

//  Props

interface MembersTableProps {
  rows: Array<{
    id: string;
    fullName: string;
    status: string;
    ministries: string;
    village: string;
    attendanceRate: number;
    joinedAt: string;
    _raw: Member;
  }>;
  currentPage: number;
  pageSize: number;
  filteredCount: number;
  onPageChange: (page: number, pageSize: number) => void;
  onSort: (field: SortField) => void;
  onDeleteMember: (member: Member) => void;
  onBatchDelete: (members: Member[]) => void;
}

//  Component

export function MembersTable({
  rows,
  currentPage,
  pageSize,
  filteredCount,
  onPageChange,
  onSort,
  onDeleteMember,
  onBatchDelete,
}: MembersTableProps) {
  const navigate = useNavigate();

  if (rows.length === 0) return null;

  return (
    <DataTable rows={rows} headers={HEADERS} isSortable>
      {({
        rows: tableRows,
        headers,
        getTableProps,
        getHeaderProps,
        getRowProps,
        getSelectionProps,
        getBatchActionProps,
        selectedRows,
      }) => (
        <TableContainer>
          <TableToolbar>
            <TableBatchActions {...getBatchActionProps()}>
              <TableBatchAction
                renderIcon={Email}
                onClick={() => alert(`Email ${selectedRows.length} member(s)`)}
              >
                Send Email
              </TableBatchAction>
              <TableBatchAction
                renderIcon={UserFollow}
                onClick={() =>
                  alert(`Assign follow-up to ${selectedRows.length} member(s)`)
                }
              >
                Assign Follow-Up
              </TableBatchAction>
              <TableBatchAction
                renderIcon={TrashCan}
                onClick={async () => {
                  const toRemove = selectedRows
                    .map((r) => rows.find((row) => row.id === r.id)?._raw)
                    .filter((m): m is Member => !!m?._firebaseKey);
                  if (!toRemove.length) return;
                  if (!window.confirm(`Delete ${toRemove.length} member(s)?`))
                    return;
                  onBatchDelete(toRemove);
                }}
              >
                Delete Selected
              </TableBatchAction>
            </TableBatchActions>
            <TableToolbarContent />
          </TableToolbar>

          <Table {...getTableProps()} size="md">
            <TableHead>
              <TableRow>
                <TableSelectAll {...getSelectionProps()} />
                {headers.map((header) => (
                  <TableHeader
                    {...getHeaderProps({ header })}
                    key={header.key}
                    onClick={() => {
                      if (
                        [
                          "fullName",
                          "status",
                          "attendanceRate",
                          "joinedAt",
                        ].includes(header.key)
                      ) {
                        onSort(header.key as SortField);
                      }
                    }}
                  >
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableRows.map((row) => {
                const raw = rows.find((r) => r.id === row.id)?._raw;
                const bg = avatarColor(raw?.id ?? "0");
                const selectionProps = getSelectionProps({ row });

                return (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    <TableSelectRow
                      {...selectionProps}
                      onSelect={(e: React.MouseEvent<HTMLInputElement>) => {
                        e.stopPropagation();
                        selectionProps.onSelect(e);
                      }}
                    />

                    {row.cells.map((cell) => {
                      // Member + avatar
                      if (cell.info.header === "fullName") {
                        return (
                          <TableCell key={cell.id}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "50%",
                                  background: bg + "22",
                                  color: bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  flexShrink: 0,
                                }}
                              >
                                {raw?._computed?.initials ?? "?"}
                              </div>
                              <span
                                style={{
                                  fontWeight: 500,
                                  fontSize: "13.5px",
                                }}
                              >
                                {cell.value as string}
                              </span>
                            </div>
                          </TableCell>
                        );
                      }

                      // Join date
                      if (cell.info.header === "joinedAt") {
                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              fontSize: "13px",
                              color: "var(--cds-text-helper, #525252)",
                            }}
                          >
                            {formatDate(cell.value as string)}
                          </TableCell>
                        );
                      }

                      // Actions
                      if (cell.info.header === "actions") {
                        return (
                          <TableCell
                            key={cell.id}
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            }
                          >
                            <OverflowMenu size="sm" flipped>
                              <OverflowMenuItem
                                itemText="View Profile"
                                onClick={() => {
                                  if (raw?._firebaseKey) {
                                    navigate(`/profile/${raw._firebaseKey}`);
                                  }
                                }}
                              />
                              <OverflowMenuItem
                                itemText="Delete Member"
                                hasDivider
                                isDelete
                                onClick={() => raw && onDeleteMember(raw)}
                              />
                            </OverflowMenu>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={cell.id} style={{ fontSize: "13px" }}>
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
            totalItems={filteredCount}
            pageSize={pageSize}
            pageSizes={[10, 25, 50, 100]}
            page={currentPage}
            onChange={({ page, pageSize: ps }) => {
              onPageChange(page, ps);
            }}
          />
        </TableContainer>
      )}
    </DataTable>
  );
}

export default MembersTable;
