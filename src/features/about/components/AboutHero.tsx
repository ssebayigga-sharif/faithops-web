import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Grid, Column } from "@carbon/react";
import styles from "../about.module.scss";
import type { StatItem } from "@/features/home/types";

// ─── Static data ──────────────────────────────────────────────────────────────
const HERO_STATS: StatItem[] = [
  { value: "1967", label: "Founded" },
  { value: "1,240+", label: "Members" },
  { value: "3", label: "Campuses" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
interface HeroStatProps {
  stat: StatItem;
}

const HeroStat: React.FC<HeroStatProps> = ({ stat }) => (
  <div className={styles["about-hero__stat"]}>
    <span className={styles["about-hero__stat-value"]}>{stat.value}</span>
    <span className={styles["about-hero__stat-label"]}>{stat.label}</span>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const AboutHero: React.FC = () => (
  <section className={styles["about-hero"]} aria-labelledby="about-hero-heading">
    {/* Decorative cross — hidden from screen readers */}
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 600 600"
      className={styles["about-hero__cross-bg"]}
    >
      <rect x="265" y="0" width="70" height="600" fill="var(--church-gold)" />
      <rect x="0" y="240" width="600" height="70" fill="var(--church-gold)" />
    </svg>

    {/* Accent strip */}
    <div className={styles["about-hero__accent-strip"]} aria-hidden />

    <Grid className={styles["about-hero__grid"]}>
      <Column sm={4} md={8} lg={10}>
        {/* ── Breadcrumb ── */}
        <Breadcrumb noTrailingSlash className={styles["about-hero__breadcrumb"]}>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>About</BreadcrumbItem>
        </Breadcrumb>

        {/* ── Eyebrow ── */}
        <div className={styles["about-hero__eyebrow"]} aria-hidden>
          <span className={styles["about-hero__eyebrow-rule"]} />
          <span className={styles["about-hero__eyebrow-text"]}>Our Identity</span>
        </div>

        {/* ── Heading ── */}
        <h1 id="about-hero-heading" className={styles["about-hero__heading"]}>
          Who We Are &amp;&nbsp;
          <span className={styles["about-hero__heading--gold"]}>
            What We Believe
          </span>
        </h1>

        {/* ── Lead paragraph ── */}
        <p className={styles["about-hero__lead"]}>
          Kampala Central is a Seventh-day Adventist congregation — a people of
          prophecy, united by a shared mission to proclaim God's final message
          of grace and judgment to East Africa and the world.
        </p>

        {/* ── Stats ── */}
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
