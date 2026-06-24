import React from "react";
import { Grid, Column, Tile } from "@carbon/react";
import styles from "../about.module.scss";
import type { MissionPillar } from "@/features/about/types";

// ─── Static data ──────────────────────────────────────────────────────────────
const PILLARS: MissionPillar[] = [
  {
    label: "Our Mission",
    icon: "✦",
    title: "Proclaim the Three Angels",
    body: "We exist to share the eternal gospel, the judgment hour, and the call to pure worship — the messages of Revelation 14 — to every person within our reach.",
    verse: '"The hour of his judgment is come." — Rev 14:7',
  },
  {
    label: "Our Vision",
    icon: "◆",
    title: "A People Prepared",
    body: "To be a Spirit-filled, outward-focused community that disciples its members into wholistic disciples — ready for the soon return of Jesus Christ.",
    verse: '"Prepare the way of the Lord." — Luke 3:4',
  },
  {
    label: "Our Values",
    icon: "✚",
    title: "Scripture · Wholeness · Service",
    body: "We hold the Bible as our only creed, pursue health of mind, body, and spirit as an act of worship, and express faith through sacrificial service to our community.",
    verse: '"Faith without works is dead." — James 2:26',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
interface PillarCardProps {
  pillar: MissionPillar;
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => (
  <Tile className={styles["pillar-card"]} aria-label={pillar.label}>
    <p className={styles["pillar-card__eyebrow"]}>{pillar.label}</p>
    <h3 className={styles["pillar-card__title"]}>{pillar.title}</h3>
    <p className={styles["pillar-card__body"]}>{pillar.body}</p>
    <blockquote className={styles["pillar-card__verse"]}>
      {pillar.verse}
    </blockquote>
  </Tile>
);

// ─── Component ────────────────────────────────────────────────────────────────
const MissionSection: React.FC = () => {
  return (
    <section
      className={`${styles.sectionCream} ${styles["mission-section"]}`}
      aria-labelledby="mission-heading"
    >
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className={styles["section-header"]}>
            <div className={styles.goldRule} aria-hidden />
            <h2 id="mission-heading" className={styles["section-heading"]}>
              Mission, Vision &amp; Values
            </h2>
          </div>
        </Column>

        {PILLARS.map((pillar) => (
          <Column key={pillar.label} sm={4} md={4} lg={5}>
            <PillarCard pillar={pillar} />
          </Column>
        ))}
      </Grid>
    </section>
  );
};

export default MissionSection;
