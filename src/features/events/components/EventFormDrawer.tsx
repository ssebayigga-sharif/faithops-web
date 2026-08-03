import {
  Button,
  Column,
  Grid,
  Stack,
  TextArea,
  TextInput,
} from "@carbon/react";
import { SlideOver } from "../../../shared/components/ui/SlideOver";
import type { EventFormDrawerProps } from "../types";

export function EventFormDrawer({
  open,
  draft,
  isSubmitting = false,
  onChange,
  onClose,
  onSubmit,
}: EventFormDrawerProps) {
  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Create Event"
      eyebrow="Events"
      description="Create a simple event entry for your church calendar."
      width="lg"
      footer={
        <>
          <Button kind="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create event"}
          </Button>
        </>
      }
    >
      <Stack className="event-form" gap={6}>
        <Grid fullWidth withRowGap>
          <Column sm={4} md={8} lg={8}>
            <TextInput
              id="event-title"
              labelText="Event name"
              placeholder="e.g. Sabbath Worship and Divine Service"
              value={draft.title}
              onChange={(event) => onChange("title", event.target.value)}
            />
          </Column>

          <Column sm={4} md={8} lg={8}>
            <TextInput
              id="event-organizer"
              labelText="Organiser"
              placeholder="e.g. Youth department"
              value={draft.organizer}
              onChange={(event) => onChange("organizer", event.target.value)}
            />
          </Column>

          <Column sm={4} md={8} lg={8}>
            <TextInput
              id="event-speaker"
              labelText="Speaker"
              placeholder="e.g. Pr. Daniel Kato"
              value={draft.speaker}
              onChange={(event) => onChange("speaker", event.target.value)}
            />
          </Column>

          <Column sm={4} md={8} lg={8}>
            <TextInput
              id="event-venue"
              labelText="Venue"
              value={draft.venue}
              onChange={(event) => onChange("venue", event.target.value)}
            />
          </Column>

          <Column sm={4} md={8} lg={8}>
            <TextInput
              id="event-date"
              labelText="Date"
              type="datetime-local"
              value={draft.date}
              onChange={(event) => onChange("date", event.target.value)}
            />
          </Column>

          <Column sm={4} md={8} lg={16}>
            <TextArea
              id="event-description"
              labelText="Simple description"
              rows={4}
              value={draft.description}
              onChange={(event) => onChange("description", event.target.value)}
              placeholder="A short description for the event."
            />
          </Column>
        </Grid>
      </Stack>
    </SlideOver>
  );
}
