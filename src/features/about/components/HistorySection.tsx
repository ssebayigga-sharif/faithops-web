import React from "react";
import { Grid, Column } from "@carbon/react";
import styles from "../about.module.scss";
import type { AboutTimelineEvent } from "@/features/about/types";

const TIMELINE: AboutTimelineEvent[] = [
  {
    year: "1844",
    event: "The Great Disappointment",
    detail:
      "William Miller's prophecy leads to re-examination of Scripture — a movement is born from the ashes of disappointment.",
  },
  {
    year: "1863",
    event: "General Conference Founded",
    detail:
      "The Seventh-day Adventist Church is formally organized in Battle Creek, Michigan with a mission to proclaim biblical truth globally.",
  },
  {
    year: "1920s",
    event: "East Africa Missions",
    detail:
      "Adventist missionaries reach Uganda, establishing schools, clinics, and congregations that form the foundation of our regional church.",
  },

  {
    year: "2010",
    event: "Kampala Campus Expansion",
    detail:
      "We launch our second campus to serve the growing Kabulengwa communities with dedicated pastoral leadership.",
  },
  {
    year: "Today",
    event: " One Mission",
    detail:
      "Kampala Central serves over 100 members , with robust outreach and health ministry programs throughout Greater Kampala.",
  },
];

interface TimelineRowProps {
  event: AboutTimelineEvent;
  isLast: boolean;
}

const TimelineRow: React.FC<TimelineRowProps> = ({ event, isLast }) => (
  <li className={styles["timeline-item"]}>
    <div className={styles["timeline-item__year"]} aria-hidden>
      {event.year}
    </div>

    {/* Connector track */}
    <div className={styles["timeline-item__track"]} aria-hidden>
      <div className={styles["timeline-item__dot"]} />
      {!isLast && <div className={styles["timeline-item__line"]} />}
    </div>

    {/* Content */}
    <div className={styles["timeline-item__content"]}>
      <h3 className={styles["timeline-item__event"]}>{event.event}</h3>
      <p className={styles["timeline-item__detail"]}>{event.detail}</p>
    </div>
  </li>
);

const HistorySection: React.FC = () => {
  return (
    <section
      className={`${styles.sectionNavy} ${styles["history-section"]}`}
      aria-labelledby="history-heading"
    >
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className={styles["section-header"]}>
            <h2
              id="history-heading"
              className={`${styles["section-heading"]} ${styles["section-heading--light"]}`}
            >
              Adventists History.
            </h2>
            <p
              className={`${styles["section-lead"]} ${styles["section-lead--muted"]}`}
            >
              From a prophetic movement in 1844 to a global church with 21
              million members — and a vibrant home in Kampala.
            </p>
          </div>
        </Column>

        <Column sm={4} md={8} lg={12}>
          <ol className={styles.timeline} aria-label="Church history timeline">
            {TIMELINE.map((event, i) => (
              <TimelineRow
                key={event.year}
                event={event}
                isLast={i === TIMELINE.length - 1}
              />
            ))}
          </ol>
        </Column>
      </Grid>
    </section>
  );
};

export default HistorySection;
