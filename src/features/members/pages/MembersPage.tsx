import { useState } from "react";
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
  Tag,
  Button,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  InlineLoading,
  InlineNotification,
  ToastNotification,
  Breadcrumb,
  BreadcrumbItem,
} from "@carbon/react";
import {
  Add,
  Download,
  Upload,
  TrashCan,
  Email,
  UserFollow,
  Renew,
} from "@carbon/icons-react";

import type { Member, SortField } from "@/features/members/types";
import { useMemberFilters } from "@/features/members/hooks/useMemberFilter";
import {
  useMembers,
  useCreateMember,
  useDeleteMember,
  usePatchMember,
} from "@/features/members/hooks/useMember";
import DeleteConfirmModal from "../components/DeleteMember";
import MemberModal from "../components/MemberModal";
import { MemberProfile } from "../components/memberprofile/MemberProfile";
import MemberFiltersBar from "../components/MemberFilters";
import {
  formatDate,
  getStatusColor,
  getAttendanceColor,
} from "@/features/members/utils/memberUtils";

// ─── Table column definitions ─────────────────────────────────────────────────

const HEADERS = [
  { key: "fullName", header: "Member" },
  { key: "id", header: "ID" },
  { key: "status", header: "Status" },
  { key: "ministries", header: "Ministry" },
  { key: "cellGroup", header: "Cell Group" },
  { key: "attendanceRate", header: "Attendance" },
  { key: "joinedAt", header: "Joined" },
  { key: "actions", header: "" },
];

const AVATAR_PALETTE = ["#0f2d52", "#c6971a", "#198038", "#6929c4", "#9f1853"];

function avatarColor(id: string): string {
  const n = parseInt(id.replace(/\D/g, ""), 10) || 0;
  return AVATAR_PALETTE[n % AVATAR_PALETTE.length];
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  accent: string;
  loading?: boolean;
}

function StatCard({ label, value, accent, loading }: StatCardProps) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e0e0e0",
        borderLeft: `4px solid ${accent}`,
        padding: "0.85rem 1.1rem",
        flex: 1,
        minWidth: 0,
      }}
    >
      <p
        style={{
          fontSize: "11px",
          color: "#6f6f6f",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      {loading ? (
        <InlineLoading description="—" />
      ) : (
        <p style={{ fontSize: "22px", fontWeight: 700, color: "#161616" }}>
          {value}
        </p>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MembersPage() {
  // ── Remote data ─────────────────────────────────────────────────────────────
  const { members, isLoading, isError, error, refetch } = useMembers();
  const { createMember, isCreating, createError } = useCreateMember();
  const { deleteMember, isDeleting } = useDeleteMember();
  const patchMutation = usePatchMember();

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    title: string;
    subtitle: string;
  } | null>(null);

  // ── Filter / sort ───────────────────────────────────────────────────────────
  const {
    filters,
    filteredMembers,
    totalCount,
    filteredCount,
    setFilter,
    setSort,
    resetFilters,
    hasActiveFilters,
  } = useMemberFilters(members);

  // ── Pagination slice ────────────────────────────────────────────────────────
  const pagedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // DataTable rows
  const rows = pagedMembers.map((m) => ({
    id: m.id,
    fullName: m._computed?.fullName ?? `${m.firstName} ${m.lastName}`,
    status: m.status,
    ministries:
      m.ministries
        .filter((mn) => mn.active)
        .map((mn) => mn.ministry)
        .join(", ") || "—",
    cellGroup: m.cellGroup,
    attendanceRate: m._computed?.attendanceRate ?? 0,
    joinedAt: m.joinedAt,
    _raw: m,
  }));

  // ── Toast helper ─────────────────────────────────────────────────────────────
  function notify(kind: "success" | "error", title: string, subtitle: string) {
    setToast({ kind, title, subtitle });
    setTimeout(() => setToast(null), 5000);
  }

  // ── Create ──────────────────────────────────────────────────────────────────
  async function handleCreateMember(member: Member) {
    try {
      // Strip client-only fields before sending to Firebase
      const { _computed, _firebaseKey, ...payload } = member as Member & {
        _firebaseKey?: string;
      };
      await createMember(payload);
      notify(
        "success",
        "Member Added",
        `${member.firstName} ${member.lastName} saved to Firebase.`,
      );
    } catch {
      notify(
        "error",
        "Save Failed",
        createError ?? "Could not save member. Check your connection.",
      );
      throw new Error(createError ?? "Could not save member.");
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDeleteConfirm() {
    if (!memberToDelete?._firebaseKey) return;
    try {
      await deleteMember(memberToDelete._firebaseKey);
      notify(
        "success",
        "Member Removed",
        `${memberToDelete.firstName} ${memberToDelete.lastName} deleted.`,
      );
      if (selectedMember?.id === memberToDelete.id) setSelectedMember(null);
    } catch {
      notify("error", "Delete Failed", "Could not remove member. Try again.");
    } finally {
      setMemberToDelete(null);
    }
  }

  // ── Deactivate (PATCH) ───────────────────────────────────────────────────────
  async function handleDeactivate(member: Member) {
    if (!member._firebaseKey) return;
    try {
      await patchMutation.mutateAsync({
        firebaseKey: member._firebaseKey,
        partial: { status: "Inactive" },
      });
      notify(
        "success",
        "Deactivated",
        `${member.firstName} ${member.lastName} set to Inactive.`,
      );
    } catch {
      notify("error", "Update Failed", "Could not update member status.");
    }
  }

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = {
    total: totalCount,
    active: members.filter((m) => m.status === "active").length,
    baptized: members.filter((m) => m.baptized).length,
    newConverts: members.filter((m) => m.status === "New convert").length,
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        background: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}>
          <ToastNotification
            kind={toast.kind}
            title={toast.title}
            subtitle={toast.subtitle}
            timeout={5000}
            onCloseButtonClick={() => setToast(null)}
          />
        </div>
      )}

      {/* Profile drawer */}
      {selectedMember && (
        <MemberProfile
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Create modal */}
      <MemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateMember}
        existingIds={members.map((m) => m.id)}
        isSubmitting={isCreating}
      />

      {/* Delete confirmation */}
      <DeleteConfirmModal
        member={memberToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setMemberToDelete(null)}
        isDeleting={isDeleting}
      />

      <div style={{ padding: "1.5rem" }}>
        {/* Page heading */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#161616",
                marginBottom: 4,
              }}
            >
              Church Membership Register
            </h1>
            <p style={{ fontSize: "13px", color: "#6f6f6f" }}>
              Kampala SDA Church ·{" "}
              {isLoading
                ? "Loading…"
                : `${totalCount.toLocaleString()} total members`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button
              kind="ghost"
              renderIcon={Renew}
              size="md"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button kind="ghost" renderIcon={Upload} size="md">
              Import CSV
            </Button>
            <Button kind="secondary" renderIcon={Download} size="md">
              Export
            </Button>
            <Button
              kind="primary"
              renderIcon={Add}
              size="md"
              onClick={() => setModalOpen(true)}
              disabled={isLoading}
            >
              Add Member
            </Button>
          </div>
        </div>

        {/* Firebase error */}
        {isError && (
          <InlineNotification
            kind="error"
            title="Failed to load members"
            subtitle={
              error ?? "Check Firebase rules and your network connection."
            }
            lowContrast
            style={{ marginBottom: "1rem" }}
          />
        )}

        {/* Save in-progress */}
        {isCreating && (
          <InlineNotification
            kind="info"
            title="Saving member…"
            subtitle="Writing to Firebase Realtime Database."
            lowContrast
            style={{ marginBottom: "1rem" }}
          />
        )}

        {/* Stat cards */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          <StatCard
            label="Total Members"
            value={stats.total.toLocaleString()}
            accent="#0f2d52"
            loading={isLoading}
          />
          <StatCard
            label="Active Members"
            value={stats.active.toLocaleString()}
            accent="#198038"
            loading={isLoading}
          />
          <StatCard
            label="Baptized"
            value={stats.baptized.toLocaleString()}
            accent="#c6971a"
            loading={isLoading}
          />
          <StatCard
            label="New Converts"
            value={stats.newConverts.toLocaleString()}
            accent="#6929c4"
            loading={isLoading}
          />
        </div>

        {/* Filters */}
        <div
          style={{
            background: "white",
            border: "1px solid #e0e0e0",
            padding: "0.75rem 1rem",
            marginBottom: "0.5rem",
          }}
        >
          <MemberFiltersBar
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onFilter={setFilter}
            onReset={resetFilters}
          />
        </div>

        {hasActiveFilters && (
          <p
            style={{
              fontSize: "12.5px",
              color: "#6f6f6f",
              marginBottom: "0.5rem",
            }}
          >
            Showing {filteredCount.toLocaleString()} of{" "}
            {totalCount.toLocaleString()} members
          </p>
        )}

        {/* Table loading */}
        {isLoading && (
          <div
            style={{
              background: "white",
              border: "1px solid #e0e0e0",
              padding: "3rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <InlineLoading
              description="Loading members from Firebase…"
              status="active"
            />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && members.length === 0 && (
          <div
            style={{
              background: "white",
              border: "1px solid #e0e0e0",
              padding: "4rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: 8 }}>
              No members yet
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#6f6f6f",
                marginBottom: "1.5rem",
              }}
            >
              Add your first church member to get started.
            </p>
            <Button renderIcon={Add} onClick={() => setModalOpen(true)}>
              Add First Member
            </Button>
          </div>
        )}

        {/* DataTable */}
        {!isLoading && rows.length > 0 && (
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
                      onClick={() =>
                        alert(`Email ${selectedRows.length} member(s)`)
                      }
                    >
                      Send Email
                    </TableBatchAction>
                    <TableBatchAction
                      renderIcon={UserFollow}
                      onClick={() =>
                        alert(
                          `Assign follow-up to ${selectedRows.length} member(s)`,
                        )
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
                        if (
                          !window.confirm(
                            `Delete ${toRemove.length} member(s)?`,
                          )
                        )
                          return;
                        await Promise.all(
                          toRemove.map((m) => deleteMember(m._firebaseKey!)),
                        );
                        notify(
                          "success",
                          "Deleted",
                          `${toRemove.length} member(s) removed.`,
                        );
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
                              setSort(header.key as SortField);
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
                        <TableRow
                          {...getRowProps({ row })}
                          key={row.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => raw && setSelectedMember(raw)}
                        >
                          <TableSelectRow
                            {...selectionProps}
                            onSelect={(
                              e: React.MouseEvent<HTMLInputElement>,
                            ) => {
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

                            // Status
                            if (cell.info.header === "status") {
                              return (
                                <TableCell key={cell.id}>
                                  <Tag
                                    type={getStatusColor(cell.value as any)}
                                    size="sm"
                                  >
                                    {cell.value as string}
                                  </Tag>
                                </TableCell>
                              );
                            }

                            // Attendance bar
                            if (cell.info.header === "attendanceRate") {
                              const rate = cell.value as number;
                              const barMap: Record<string, string> = {
                                green: "#24a148",
                                teal: "#009d9a",
                                yellow: "#f1c21b",
                                red: "#da1e28",
                              };
                              const barColor = barMap[getAttendanceColor(rate)];
                              return (
                                <TableCell key={cell.id}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 60,
                                        height: 5,
                                        background: "#f4f4f4",
                                        borderRadius: 3,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: `${rate}%`,
                                          height: "100%",
                                          background: barColor,
                                          borderRadius: 3,
                                        }}
                                      />
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: barColor,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {rate}%
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
                                  style={{ fontSize: "13px", color: "#525252" }}
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
                                      onClick={() =>
                                        raw && setSelectedMember(raw)
                                      }
                                    />
                                    <OverflowMenuItem itemText="Edit Member" />
                                    <OverflowMenuItem itemText="Assign Follow-Up" />
                                    <OverflowMenuItem itemText="Record Attendance" />
                                    <OverflowMenuItem itemText="Add Note" />
                                    <OverflowMenuItem
                                      itemText="Deactivate"
                                      onClick={() =>
                                        raw && handleDeactivate(raw)
                                      }
                                    />
                                    <OverflowMenuItem
                                      itemText="Delete Member"
                                      hasDivider
                                      isDelete
                                      onClick={() =>
                                        raw && setMemberToDelete(raw)
                                      }
                                    />
                                  </OverflowMenu>
                                </TableCell>
                              );
                            }

                            return (
                              <TableCell
                                key={cell.id}
                                style={{ fontSize: "13px" }}
                              >
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
                    setCurrentPage(page);
                    setPageSize(ps);
                  }}
                />
              </TableContainer>
            )}
          </DataTable>
        )}
      </div>
    </div>
  );
}
