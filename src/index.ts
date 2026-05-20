// ─── Page ─────────────────────────────────────────────────────────────────────
export { default as MembersPage } from "./Pages/members/Members";
export { default as EventsPage } from "./Pages/events/Events";

// ─── Components ───────────────────────────────────────────────────────────────
export { default as MemberModal } from "./Pages/members/MemberModal";
export { MemberProfile } from "./Pages/members/memberprofile/MemberProfile";
export { default as MemberFiltersBar } from "./Pages/members/MemberFilters";

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useMemberFilters } from "@/utils/useMemberFilter";

export {
  useMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
  usePatchMember,
  memberKeys,
} from "./utils/useMember";
export {
  useEvents,
  useCreateEvent,
  usePatchEvent,
  eventKeys,
} from "./utils/useEvent";

// ─── Service ──────────────────────────────────────────────────────────────────
export { MemberService } from "./services/member.services";
export { EventService } from "./services/event.services";
export {
  firebaseClient,
  normaliseError,
  isFirebaseApiError,
  FIREBASE_BASE_URL,
} from "./services/firebase.client";

// ─── Utils ────────────────────────────────────────────────────────────────────
export * from "@/utils/memberUtils";

// ─── Types ────────────────────────────────────────────────────────────────────
export type * from "@/churchTypes/memberTypes";
