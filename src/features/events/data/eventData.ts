import type { EventFormDraft } from "@/features/events/types";

export const DEFAULT_EVENT_DRAFT: EventFormDraft = {
  title: "",
  description: "",
  venue: "KESDA",
  date: "2026-05-23T08:30",
  organizer: "",
  speaker: "",
};
