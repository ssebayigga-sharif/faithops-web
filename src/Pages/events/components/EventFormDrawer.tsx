import {
  Button,
  Checkbox,
  Column,
  FileUploaderDropContainer,
  FormGroup,
  Grid,
  Select,
  SelectItem,
  Stack,
  TextArea,
  TextInput,
  Toggle,
} from "@carbon/react";
import { SlideOver } from "@/components/ui/SlideOver";
import type {
  CommunicationChannel,
  EventCategory,
  EventDepartment,
  EventFormDrawerProps,
  EventRecurrenceFrequency,
} from "@/churchTypes/eventTypes";
import {
  COMMUNICATION_CHANNELS,
  EVENT_CATEGORIES,
  EVENT_DEPARTMENTS,
  RECURRENCE_OPTIONS,
} from "../eventData";

export function EventFormDrawer({
  open,
  draft,
  isSubmitting = false,
  onChange,
  onClose,
  onSubmit,
}: EventFormDrawerProps) {
  function updateChannel(channel: CommunicationChannel, checked: boolean) {
    const channels = checked
      ? [...new Set([...draft.communicationChannels, channel])]
      : draft.communicationChannels.filter((item) => item !== channel);

    onChange("communicationChannels", channels);
  }

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Create Event"
      eyebrow="Events"
      description="Schedule SDA programs with recurrence, responsibilities, communications, media, and approval-ready operational detail."
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
              labelText="Event title"
              placeholder="e.g. Sabbath Worship and Divine Service"
              value={draft.title}
              onChange={(event) => onChange("title", event.target.value)}
            />
          </Column>
          <Column sm={4} md={4} lg={4}>
            <Select
              id="event-department"
              labelText="Department"
              value={draft.department}
              onChange={(event) =>
                onChange("department", event.target.value as EventDepartment)
              }
            >
              {EVENT_DEPARTMENTS.map((department) => (
                <SelectItem key={department} value={department} text={department} />
              ))}
            </Select>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <Select
              id="event-category"
              labelText="Event type"
              value={draft.category}
              onChange={(event) =>
                onChange("category", event.target.value as EventCategory)
              }
            >
              {EVENT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category} text={category} />
              ))}
            </Select>
          </Column>

          <Column sm={4} md={8} lg={16}>
            <TextArea
              id="event-description"
              labelText="Description"
              rows={4}
              value={draft.description}
              onChange={(event) => onChange("description", event.target.value)}
              placeholder="Purpose, pastoral notes, attendance expectations, and follow-up goals."
            />
          </Column>

          <Column sm={4} md={4} lg={4}>
            <TextInput
              id="event-venue"
              labelText="Venue"
              value={draft.venue}
              onChange={(event) => onChange("venue", event.target.value)}
            />
          </Column>
          <Column sm={4} md={4} lg={4}>
            <TextInput
              id="event-speaker"
              labelText="Speaker / preacher"
              value={draft.speaker}
              onChange={(event) => onChange("speaker", event.target.value)}
              placeholder="Speaker, preacher, or program lead"
            />
          </Column>
          <Column sm={4} md={4} lg={4}>
            <TextInput
              id="event-start"
              labelText="Start time"
              type="datetime-local"
              value={draft.start}
              onChange={(event) => onChange("start", event.target.value)}
            />
          </Column>
          <Column sm={4} md={4} lg={4}>
            <TextInput
              id="event-end"
              labelText="End time"
              type="datetime-local"
              value={draft.end}
              onChange={(event) => onChange("end", event.target.value)}
            />
          </Column>

          <Column sm={4} md={4} lg={4}>
            <Select
              id="event-recurrence"
              labelText="Recurring event settings"
              value={draft.recurrenceFrequency}
              onChange={(event) =>
                onChange(
                  "recurrenceFrequency",
                  event.target.value as EventRecurrenceFrequency,
                )
              }
            >
              {RECURRENCE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} text={option} />
              ))}
            </Select>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <TextInput
              id="event-capacity"
              labelText="Capacity"
              type="number"
              min={0}
              value={draft.capacity}
              onChange={(event) => onChange("capacity", Number(event.target.value))}
            />
          </Column>
          <Column sm={4} md={4} lg={4}>
            <TextInput
              id="event-volunteers"
              labelText="Volunteers needed"
              type="number"
              min={0}
              value={draft.volunteersNeeded}
              onChange={(event) =>
                onChange("volunteersNeeded", Number(event.target.value))
              }
            />
          </Column>
          <Column sm={4} md={4} lg={4}>
            <TextInput
              id="event-budget"
              labelText="Budget allocation"
              type="number"
              min={0}
              value={draft.budgetAllocated}
              onChange={(event) =>
                onChange("budgetAllocated", Number(event.target.value))
              }
            />
          </Column>

          <Column sm={4} md={8} lg={8}>
            <Toggle
              id="event-registration"
              labelText="Registration required"
              labelA="No"
              labelB="Yes"
              toggled={draft.registrationRequired}
              onToggle={(checked) => onChange("registrationRequired", checked)}
            />
          </Column>

          <Column sm={4} md={8} lg={8}>
            <FormGroup legendText="Communication channels">
              <Stack className="event-checkbox-grid" gap={3}>
                {COMMUNICATION_CHANNELS.map((channel) => (
                  <Checkbox
                    id={`event-channel-${channel}`}
                    key={channel}
                    labelText={channel}
                    checked={draft.communicationChannels.includes(channel)}
                    onChange={(_, data) => updateChannel(channel, data.checked)}
                  />
                ))}
              </Stack>
            </FormGroup>
          </Column>

          <Column sm={4} md={8} lg={16}>
            <TextInput
              id="event-attachments"
              labelText="Attachments / media links"
              value={draft.attachments}
              onChange={(event) => onChange("attachments", event.target.value)}
              placeholder="Sermon notes, posters, recordings, reports, budget links"
            />
          </Column>

          <Column sm={4} md={8} lg={16}>
            <FileUploaderDropContainer
              accept={[".pdf", ".png", ".jpg", ".jpeg", ".docx", ".xlsx", ".mp4"]}
              id="event-media-upload"
              labelText="Drag files here or click to add event media"
              multiple
              name="event-media-upload"
            />
          </Column>
        </Grid>
      </Stack>
    </SlideOver>
  );
}
