import React, { useMemo } from "react";
import { Grid, Column, InlineNotification } from "@carbon/react";
import styles from "../homepage.module.scss";
import { useEvents } from "@/features/events/hooks/useEvent";
import { getUpcomingEvents } from "@/features/events/eventUtils";
import EventCard from "./EventCard";

const EventsSection: React.FC = () => {
  const { events, isLoading, isError, error } = useEvents();
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(events, new Date()),
    [events],
  );

  return (
    <section
      className={`${styles.churchSection} ${styles.churchSectionLayer}`}
      aria-labelledby="events-heading"
    >
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div className={styles.churchSectionHeader}>
            <h2
              id="events-heading"
              className={styles.churchSectionHeader__title}
            >
              Upcoming Events
            </h2>
          </div>
        </Column>

        {isLoading && (
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="info"
              title="Loading events"
              subtitle="Fetching upcoming events."
              lowContrast
              hideCloseButton
            />
          </Column>
        )}

        {isError && (
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="error"
              title="Could not load events"
              subtitle={
                error ?? "Check Firebase rules and your network connection."
              }
              lowContrast
              hideCloseButton
            />
          </Column>
        )}

        {!isLoading && !isError && upcomingEvents.length === 0 && (
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="info"
              title="No upcoming events"
              subtitle="Add future events on the Events page to show them here."
              lowContrast
              hideCloseButton
            />
          </Column>
        )}

        {!isLoading &&
          !isError &&
          upcomingEvents.slice(0, 6).map((event, index) => (
            <Column key={event._firebaseKey ?? event.id} lg={8} md={4} sm={4}>
              <EventCard event={event} index={index + 1} />
            </Column>
          ))}
      </Grid>
    </section>
  );
};

export default EventsSection;
