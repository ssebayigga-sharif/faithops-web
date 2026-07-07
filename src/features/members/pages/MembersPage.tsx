import { lazy, Suspense, useState } from "react";
import {
  InlineLoading,
  InlineNotification,
  ToastNotification,
  Stack,
} from "@carbon/react";

import type { Member, SortField } from "@/features/members/types";
import { useMemberFilters } from "@/features/members/hooks/useMemberFilter";
import {
  useMembers,
  useCreateMember,
  useDeleteMember,
} from "@/features/members/hooks/useMember";

// Dynamic imports for code splitting
const DeleteConfirmModal = lazy(
  () => import("@/features/members/components/DeleteMember"),
);
const MemberModal = lazy(
  () => import("@/features/members/components/MemberModal"),
);
const MemberFiltersBar = lazy(
  () => import("@/features/members/components/MemberFilters"),
);
const MembersPageHeader = lazy(
  () => import("@/features/members/components/MembersPageHeader"),
);
const MembersStatsCards = lazy(
  () => import("@/features/members/components/MembersStatsCards"),
);
const MembersTable = lazy(
  () => import("@/features/members/components/MembersTable"),
);
const MembersEmptyState = lazy(
  () => import("@/features/members/components/MembersEmptyState"),
);

//  Main page

export default function MembersPage() {
  //  Remote data
  const { members, isLoading, isError, error, refetch } = useMembers();
  const { createMember, isCreating, createError } = useCreateMember();
  const { deleteMember, isDeleting } = useDeleteMember();

  //  Local UI state
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    title: string;
    subtitle: string;
  } | null>(null);

  //  Filter members
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

  //  Pagination slice
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
    village: m.cellGroup,
    attendanceRate: m._computed?.attendanceRate ?? 0,
    joinedAt: m.joinedAt,
    _raw: m,
  }));

  // Notifier
  function notify(kind: "success" | "error", title: string, subtitle: string) {
    setToast({ kind, title, subtitle });
    setTimeout(() => setToast(null), 5000);
  }

  // ── Create member
  async function handleCreateMember(member: Member) {
    try {
      const { _computed, _firebaseKey, ...payload } = member as Member & {
        _firebaseKey?: string;
      };
      await createMember(payload);
      notify(
        "success",
        "Member Added",
        `${member.firstName} ${member.lastName} saved `,
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

  // ── Delete
  async function handleDeleteConfirm() {
    if (!memberToDelete?._firebaseKey) return;
    try {
      await deleteMember(memberToDelete._firebaseKey);
      notify(
        "success",
        "Member Removed",
        `${memberToDelete.firstName} ${memberToDelete.lastName} deleted.`,
      );
    } catch {
      notify("error", "Delete Failed", "Could not remove member. Try again.");
    } finally {
      setMemberToDelete(null);
    }
  }

  // ── Batch delete
  async function handleBatchDelete(toRemove: Member[]) {
    await Promise.all(toRemove.map((m) => deleteMember(m._firebaseKey!)));
    notify("success", "Deleted", `${toRemove.length} member(s) removed.`);
  }

  const loader = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "3rem",
      }}
    >
      <InlineLoading description="Loading..." status="active" />
    </div>
  );

  return (
    <Stack as="main" className="admin-page members-page">
      <Stack className="admin-page__inner" gap={5}>
        {/* Toast notification */}
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

        {/* Create modal */}
        <Suspense fallback={null}>
          <MemberModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleCreateMember}
            existingIds={members.map((m) => m.id)}
            isSubmitting={isCreating}
          />
        </Suspense>

        {/* Delete confirmation */}
        <Suspense fallback={null}>
          <DeleteConfirmModal
            member={memberToDelete}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setMemberToDelete(null)}
            isDeleting={isDeleting}
          />
        </Suspense>

        {/* Page header */}
        <Suspense fallback={loader}>
          <MembersPageHeader
            totalCount={totalCount}
            isLoading={isLoading}
            filteredCount={filteredCount}
            hasActiveFilters={hasActiveFilters}
            onRefresh={() => refetch()}
            onAddMember={() => setModalOpen(true)}
          />
        </Suspense>

        {/* Error */}
        {isError && (
          <InlineNotification
            kind="error"
            title="Failed to load members"
            subtitle={
              error ?? "Check Firebase rules and your network connection."
            }
            lowContrast
          />
        )}

        {/* Saving indicator */}
        {isCreating && (
          <InlineNotification
            kind="info"
            title="Saving member…"
            subtitle="Writing to Firebase Realtime Database."
            lowContrast
          />
        )}

        {/* Stat cards */}
        <Suspense fallback={loader}>
          <MembersStatsCards members={members} isLoading={isLoading} />
        </Suspense>

        {/* Filters */}
        <div className="dashboard-section">
          <div className="dashboard-section__body">
            <Suspense fallback={null}>
              <MemberFiltersBar
                search={filters.search}
                onSearch={(value) => setFilter("search", value)}
                onReset={resetFilters}
              />
            </Suspense>
          </div>
        </div>

        {/* Table loading */}
        {isLoading && (
          <div className="dashboard-section">
            <div
              className="dashboard-section__body"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "3rem",
              }}
            >
              <InlineLoading
                description="Loading members...."
                status="active"
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && members.length === 0 && (
          <Suspense fallback={loader}>
            <MembersEmptyState onAddMember={() => setModalOpen(true)} />
          </Suspense>
        )}

        {/* Data table */}
        {!isLoading && rows.length > 0 && (
          <div className="dashboard-section">
            <div className="dashboard-section__body" style={{ padding: 0 }}>
              <Suspense fallback={loader}>
                <MembersTable
                  rows={rows}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  filteredCount={filteredCount}
                  onPageChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  onSort={(field: SortField) => setSort(field)}
                  onDeleteMember={(member) => setMemberToDelete(member)}
                  onBatchDelete={(members) => handleBatchDelete(members)}
                />
              </Suspense>
            </div>
          </div>
        )}
      </Stack>
    </Stack>
  );
}
