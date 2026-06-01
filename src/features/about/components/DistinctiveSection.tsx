import React from "react";
import { Grid, Column, Tile } from "@carbon/react";
import { useFadeIn } from "@/features/home/useFadeIn";
import styles from "../about.module.scss";
import type { Distinctive } from "@/features/about/types";

// ─── Static data ──────────────────────────────────────────────────────────────
const DISTINCTIVES: Distinctive[] = [
  {
    icon: "📖",
    title: "Sola Scriptura",
    body: 'Scripture alone is our creed. Every doctrine is tested by "the law and the testimony" (Isaiah 8:20). We interpret the Bible using the Bible.',
  },
  {
    icon: "🕯",
    title: "The Sabbath (Saturday)",
    body: "The seventh-day Sabbath is God's memorial of creation and redemption. We rest, worship, and delight in God from Friday sunset to Saturday sunset.",
  },
  {
    icon: "🏥",
    title: "Wholistic Health",
    body: "Based on the NEWSTART principles, we believe the body is a temple of the Holy Spirit. Health reform is an act of worship and preparation.",
  },
  {
    icon: "✝",
    title: "The Sanctuary Message",
    body: "Christ is our High Priest ministering in the heavenly sanctuary. His atonement is the foundation of our salvation and the basis of our judgment-hour message.",
  },
  {
    icon: "🌍",
    title: "Prophetic Mission",
    body: "We understand our identity through Bible prophecy — we are the remnant church called to proclaim the Three Angels' Messages before Christ's return.",
  },
  {
    icon: "✉",
    title: "Personal Evangelism",
    body: "Every member is called to be a missionary. We equip each believer to share their faith through Bible studies, community service, and personal witness.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
interface DistinctiveCardProps {
  distinctive: Distinctive;
}

const DistinctiveCard: React.FC<DistinctiveCardProps> = ({ distinctive }) => (
  <Tile
    className={`${styles["distinctive-card"]} ${styles.fadeUp}`}
    aria-label={distinctive.title}
    data-animate
  >
    {/* Gold top rule */}
    <div className={styles["distinctive-card__rule"]} aria-hidden />
    <div
      className={styles["distinctive-card__icon"]}
      aria-hidden
      role="presentation"
    >
      {distinctive.icon}
    </div>
    <h3 className={styles["distinctive-card__title"]}>{distinctive.title}</h3>
    <p className={styles["distinctive-card__body"]}>{distinctive.body}</p>
  </Tile>
);

// ─── Component ────────────────────────────────────────────────────────────────
const DistinctivesSection: React.FC = () => {
  const ref = useFadeIn();

  return (
    <section
      className={`${styles.sectionWhite} ${styles["distinctives-section"]}`}
      ref={ref}
      aria-labelledby="distinctives-heading"
    >
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div
            data-animate
            className={`${styles["section-header"]} ${styles["section-header--center"]} ${styles.fadeUp}`}
          >
            <div className={styles.goldRuleCenter} aria-hidden />
            <h2
              id="distinctives-heading"
              className={styles["section-heading"]}
            >
              What Makes Us Adventist
            </h2>
            <p className={styles["section-lead"]}>
              Six distinctive convictions that shape how we worship, live, and
              serve.
            </p>
          </div>
        </Column>

        {DISTINCTIVES.map((d) => (
          <Column key={d.title} sm={4} md={4} lg={5}>
            <DistinctiveCard distinctive={d} />
          </Column>
        ))}
      </Grid>
    </section>
  );
};

export default DistinctivesSection;
