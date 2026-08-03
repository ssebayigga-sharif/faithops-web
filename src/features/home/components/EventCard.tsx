import React from "react";
import { Tile } from "@carbon/react";
import { Time, Location } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import {
  formatEventDate,
  formatEventTime,
} from "../../events/eventUtils";
import type { ChurchEvent } from "../../events/types";

const EventCard: React.FC<{ event: ChurchEvent; index: number }> = ({
  event,
  index,
}) => (
  <Tile className={styles.churchEventTile} aria-label={event.title}>
    <div className={styles.churchEventTile__date} aria-hidden="true">
      <span className={styles.churchEventTile__day}>{index}</span>
      <span className={styles.churchEventTile__month}>No.</span>
    </div>

    <div className={styles.churchEventTile__body}>
      <h3 className={styles.churchEventTile__title}>{event.title}</h3>
      <ul className={styles.churchEventTile__meta} aria-label="Event details">
        <li>{formatEventDate(event.start)}</li>
        <li>
          <Time size={12} aria-hidden="true" /> {formatEventTime(event.start)}
        </li>
        <li>
          <Location size={12} aria-hidden="true" /> {event.venue}
        </li>
        <li>{event.department}</li>
      </ul>
    </div>
  </Tile>
);

export default React.memo(EventCard);
