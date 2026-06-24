import React, { useState, useCallback, useMemo } from "react";
import {
  Grid,
  Column,
  Button,
  ContentSwitcher,
  Switch,
  InlineNotification,
} from "@carbon/react";
import { Calendar } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import { UPCOMING_EVENTS } from "@/features/home/data/home";
import { useFadeIn } from "../useFadeIn";
import EventCard from "./EventCard";
import type { HomeChurchEvent } from "@/features/home/types";

const ALL_LABEL = "All";

const EventsSection: React.FC = () => {
  const ref = useFadeIn<HTMLElement>();

  const categories = useMemo(
    () => [
      ALL_LABEL,
      ...Array.from(new Set(UPCOMING_EVENTS.map((e) => e.category))),
    ],
    [],
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const activeCategory = categories[activeIdx];
  const filtered =
    activeCategory === ALL_LABEL
      ? UPCOMING_EVENTS
      : UPCOMING_EVENTS.filter(
          (e: HomeChurchEvent) => e.category === activeCategory,
        );

  const handleSwitch = useCallback(
    (info: { index?: number; name?: string | number; text?: string }) => {
      if (info.index !== undefined) {
        setActiveIdx(info.index);
      }
    },
    [],
  );

  return (
    <section
      ref={ref}
      className={`${styles.churchSection} ${styles.churchSectionLayer}`}
      aria-labelledby="events-heading"
    >
      <Grid>
        <Column lg={10} md={5} sm={4}>
          <div data-animate className={styles.fadeUp}>
            <span className={styles.churchGoldRule} aria-hidden="true" />
            <h2
              id="events-heading"
              className={styles.churchSectionHeader__title}
            >
              Upcoming Events
            </h2>
            <p className={styles.churchSectionSubhead}>
              See what's happening in our community.
            </p>
          </div>
        </Column>

        <Column lg={6} md={3} sm={4} className={styles.churchEvents}>
          <div data-animate className={styles.fadeUp}>
            <Button
              kind="ghost"
              renderIcon={Calendar}
              className={styles.churchBtnOutline}
              size="sm"
            >
              Full Calendar
            </Button>
          </div>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <div data-animate className={styles.fadeUp}>
            <ContentSwitcher
              onChange={handleSwitch}
              selectedIndex={activeIdx}
              size="sm"
              className={styles.churchEvents__switcher}
            >
              {categories.map((cat) => (
                <Switch key={cat} name={cat} text={cat} />
              ))}
            </ContentSwitcher>
          </div>
        </Column>

        {filtered.length === 0 ? (
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="info"
              title="No events found"
              subtitle="Try a different category."
              lowContrast
              hideCloseButton
            />
          </Column>
        ) : (
          filtered.map((ev: HomeChurchEvent, i: number) => (
            <Column key={ev.id} lg={4} md={4} sm={4}>
              <div
                data-animate
                className={styles.fadeUp}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <EventCard event={ev} />
              </div>
            </Column>
          ))
        )}
      </Grid>
    </section>
  );
};

export default EventsSection;
