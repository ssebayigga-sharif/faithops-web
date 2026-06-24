import React from "react";
import { Tag, ClickableTile } from "@carbon/react";
import { Time, Location } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import type { HomeChurchEvent } from "@/features/home/types";

const EventCard: React.FC<{ event: HomeChurchEvent }> = ({ event }) => (
  <ClickableTile
    className={styles.churchEventTile}
    aria-label={`${event.title} on ${event.month} ${event.day}`}
  >
    <div className={styles.churchEventTile__date} aria-hidden="true">
      <span className={styles.churchEventTile__day}>{event.day}</span>
      <span className={styles.churchEventTile__month}>{event.month}</span>
    </div>

    <div className={styles.churchEventTile__body}>
      <Tag type="gray" size="sm" className={styles.churchEventTile__tag}>
        {event.category}
      </Tag>
      <h3 className={styles.churchEventTile__title}>{event.title}</h3>
      <ul className={styles.churchEventTile__meta} aria-label="Event details">
        <li>
          <Time size={12} aria-hidden="true" /> {event.time}
        </li>
        <li>
          <Location size={12} aria-hidden="true" /> {event.location}
        </li>
      </ul>
    </div>
  </ClickableTile>
);

export default React.memo(EventCard);
