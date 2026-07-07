import type { UseQueryResult } from "@tanstack/react-query";

export type EventCalendarView = "month" | "week" | "day" | "agenda";

export type EventDepartment =
  | "Pastoral"
  | "Sabbath School"
  | "Youth"
  | "Pathfinder"
  | "Evangelism"
  | "Health"
  | "Music"
  | "Treasury"
  | "Clerk"
  | "Community Services"
  | "Board";

export type EventCategory =
  | "Sabbath Service"
  | "Divine Service"
  | "AY Program"
  | "Evangelism"
  | "Pathfinder"
  | "Communion"
  | "Prayer Meeting"
  | "Camp Meeting"
  | "Health Seminar"
  | "Bible Study"
  | "Choir Practice"
  | "Board Meeting"
  | "Baptism Class"
  | "Community Outreach";

export type EventColorKey =
  | "sabbath"
  | "youth"
  | "evangelism"
  | "pathfinder"
  | "choir"
  | "board"
  | "communion"
  | "health"
  | "prayer";

export type EventStatus =
  | "Approved"
  | "Pending approval"
  | "Needs volunteers"
  | "Draft"
  | "Completed";

export type EventRecurrenceFrequency =
  | "None"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Annual";

export type VolunteerStatus = "Assigned" | "Confirmed" | "Needed";
export type CommunicationChannel = "Email" | "SMS" | "WhatsApp" | "Push";

export type PermissionRole =
  | "Youth leader"
  | "Pathfinder director"
  | "Church clerk"
  | "Pastor"
  | "Treasurer"
  | "Department leader";

export type PermissionLevel = "Manage" | "View all" | "Approve" | "Finance";

export interface EventRecurrence {
  frequency: EventRecurrenceFrequency;
  rule: string;
  until?: string;
}

export interface EventVolunteerAssignment {
  role: string;
  assignee: string;
  department: EventDepartment;
  status: VolunteerStatus;
  callTime: string;
}

export interface EventAttendanceStats {
  registered: number;
  actual: number;
  members: number;
  visitors: number;
  followUpRequired: number;
  conversions: number;
  baptisms: number;
}

export interface EventCommunicationPlan {
  channels: CommunicationChannel[];
  rsvpTracking: boolean;
  automations: string[];
}

export interface EventMediaAttachment {
  type: "Sermon notes" | "Poster" | "Photo" | "Recording" | "Report" | "Budget";
  name: string;
  owner: string;
  status: "Draft" | "Ready" | "Archived";
}

export interface EventPermission {
  role: PermissionRole;
  scope: string;
  level: PermissionLevel;
}

export interface EventEnterpriseFeature {
  label: string;
  status: "Designed" | "Planned" | "Ready";
}

export interface ChurchEvent {
  _firebaseKey?: string;
  id: string;
  title: string;
  description: string;
  organizer?: string;
  department: EventDepartment;
  category: EventCategory;
  colorKey: EventColorKey;
  venue: string;
  start: string;
  end: string;
  recurrence: EventRecurrence;
  speaker: string;
  capacity: number;
  registrationRequired: boolean;
  volunteersNeeded: number;
  budgetAllocated: number;
  budgetSpent: number;
  status: EventStatus;
  attendance: EventAttendanceStats;
  volunteers: EventVolunteerAssignment[];
  communications: EventCommunicationPlan;
  permissions: EventPermission[];
  attachments: EventMediaAttachment[];
  notes: string[];
  reports: string[];
  enterpriseReadiness: EventEnterpriseFeature[];
}

export interface EventFormDraft {
  title: string;
  description: string;
  venue: string;
  date: string;
  organizer: string;
  speaker: string;
}

export interface EventTrendPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface DepartmentActivity {
  department: EventDepartment;
  count: number;
  percent: number;
}

export interface EventAnalyticsSnapshot {
  upcomingEvents: number;
  thisMonthEvents: number;
  averageAttendance: number;
  mostActiveDepartment: EventDepartment;
  baptismsFromEvents: number;
  volunteerParticipationRate: number;
  monthlyTrend: EventTrendPoint[];
  attendanceGrowth: EventTrendPoint[];
  departmentActivity: DepartmentActivity[];
}

export interface EventDetailsDrawerProps {
  event: ChurchEvent | null;
  open: boolean;
  onClose: () => void;
}

export interface EventFormDrawerProps {
  open: boolean;
  draft: EventFormDraft;
  isSubmitting?: boolean;
  onChange: <Key extends keyof EventFormDraft>(
    field: Key,
    value: EventFormDraft[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
}

export interface UseEventsResult {
  events: ChurchEvent[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: UseQueryResult<ChurchEvent[], unknown>["refetch"];
}

export interface UseCreateEventResult {
  createEvent: (
    event: Omit<ChurchEvent, "_firebaseKey">,
  ) => Promise<ChurchEvent>;
  isCreating: boolean;
  createError: string | null;
}
