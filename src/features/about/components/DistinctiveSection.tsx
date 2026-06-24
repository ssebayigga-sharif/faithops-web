import React from "react";
import { Grid, Column, Tile } from "@carbon/react";
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

// ─── Icon Helper ──────────────────────────────────────────────────────────────
const getDistinctiveIcon = (title: string) => {
  if (title === "Sola Scriptura") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  if (title === "The Sabbath (Saturday)") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }
  if (title === "Wholistic Health") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }
  if (title === "The Sanctuary Message") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (title === "Prophetic Mission") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  }
  // Personal Evangelism
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
interface DistinctiveCardProps {
  distinctive: Distinctive;
}

const DistinctiveCard: React.FC<DistinctiveCardProps> = ({ distinctive }) => (
  <Tile
    className={styles["distinctive-card"]}
    aria-label={distinctive.title}
  >
    <div className={styles["distinctive-card__icon-wrapper"]} aria-hidden>
      {getDistinctiveIcon(distinctive.title)}
    </div>
    <h3 className={styles["distinctive-card__title"]}>{distinctive.title}</h3>
    <p className={styles["distinctive-card__body"]}>{distinctive.body}</p>
  </Tile>
);

// ─── Component ────────────────────────────────────────────────────────────────
const DistinctivesSection: React.FC = () => {
  return (
    <section
      className={`${styles.sectionWhite} ${styles["distinctives-section"]}`}
      aria-labelledby="distinctives-heading"
    >
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className={`${styles["section-header"]} ${styles["section-header--center"]}`}>
            <div className={styles.goldRuleCenter} aria-hidden />
            <h2 id="distinctives-heading" className={styles["section-heading"]}>
              What Makes Us Adventist
            </h2>
            <p className={styles["section-lead"]}>
              Six distinctive convictions that shape how we worship, live, and serve.
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
