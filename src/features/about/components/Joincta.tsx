import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@carbon/react";
import { ArrowRight, Home } from "@carbon/icons-react";
import styles from "../about.module.scss";

// ─── Component ────────────────────────────────────────────────────────────────
const JoinCTA: React.FC = () => (
  <section className={styles["join-cta"]} aria-labelledby="join-cta-heading">
    {/* Decorative cross */}
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 400 400"
      className={styles["join-cta__cross-bg"]}
    >
      <rect x="180" y="20" width="40" height="360" fill="var(--church-gold)" />
      <rect x="20" y="160" width="360" height="40" fill="var(--church-gold)" />
    </svg>

    <div className={styles["join-cta__inner"]}>
      <div className={styles.goldRuleCenter} aria-hidden />

      <h2 id="join-cta-heading" className={styles["join-cta__heading"]}>
        Come Worship With Us This Sabbath
      </h2>

      <p className={styles["join-cta__body"]}>
        We gather every Saturday at 9:00&nbsp;AM for Sabbath School and
        11:00&nbsp;AM for Divine Worship. New faces are always welcome — come as
        you are.
      </p>

      <div className={styles["join-cta__actions"]}>
        {/*
          Carbon Button used as a React Router Link via the `as` prop.
          `renderIcon` replaces the old inline <ArrowRight /> usage.
        */}
        <Button
          as={Link}
          to="/contact"
          kind="primary"
          renderIcon={ArrowRight}
          iconDescription="Navigate to Plan Your Visit"
          className={styles["join-cta__btn"]}
        >
          Plan Your Visit
        </Button>

        <Button
          as={Link}
          to="/"
          kind="tertiary"
          renderIcon={Home}
          iconDescription="Navigate to Home"
          className={styles["join-cta__btn"]}
        >
          Back to Home
        </Button>
      </div>
    </div>
  </section>
);

export default JoinCTA;
