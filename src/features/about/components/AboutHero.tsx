import React from "react";
import { Grid, Column } from "@carbon/react";
import styles from "../about.module.scss";
import type { StatItem } from "@/features/home/types";

// Static data
const HERO_STATS: StatItem[] = [
  { value: "2020", label: "Founded" },
  { value: "100+", label: "Members" },
];

//  Sub-components
interface HeroStatProps {
  stat: StatItem;
}

const HeroStat: React.FC<HeroStatProps> = ({ stat }) => (
  <div className={styles["about-hero__stat-card"]}>
    <span className={styles["about-hero__stat-value"]}>{stat.value}</span>
    <span className={styles["about-hero__stat-label"]}>{stat.label}</span>
  </div>
);

// ─── Component
const AboutHero: React.FC = () => (
  <section
    className={styles["about-hero"]}
    aria-labelledby="about-hero-heading"
  >
    <Grid className={styles["about-hero__grid"]}>
      <Column sm={4} md={8} lg={10}>
        {/* ── Heading ── */}
        <h1 id="about-hero-heading" className={styles["about-hero__heading"]}>
          Who We Are &amp;&nbsp;
          <span className={styles["about-hero__heading--gold"]}>
            What We Believe
          </span>
        </h1>

        {/* ── Lead paragraph ── */}
        <p className={styles["about-hero__lead"]}>
          Kabulengwa is a Seventh-day Adventist congregation — a people of
          prophecy, united by a shared mission to proclaim God's final message
          to the whole world.
        </p>

        {/* Stats */}
        <div
          className={styles["about-hero__stats"]}
          role="list"
          aria-label="Congregation statistics"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label} role="listitem">
              <HeroStat stat={stat} />
            </div>
          ))}
        </div>
      </Column>
    </Grid>
  </section>
);

export default AboutHero;
