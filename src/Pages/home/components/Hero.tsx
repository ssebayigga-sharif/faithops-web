import React from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Button } from "@carbon/react";
import { ArrowRight, PlayFilledAlt } from "@carbon/icons-react";
import styles from "../homepage.module.scss";

const Hero: React.FC = () => (
  <section className={styles.churchHero}>
    <svg className={styles.churchHero__cross} aria-hidden="true" viewBox="0 0 600 600">
      <rect x="265" y="0" width="70" height="600" fill="currentColor" />
      <rect x="0" y="240" width="600" height="70" fill="currentColor" />
    </svg>

    <div className={styles.churchHero__overlay} aria-hidden="true" />

    <Grid className={styles.churchHero__grid}>
      <Column lg={8} md={6} sm={4}>
        <div className={styles.churchHero__eyebrow}>
          <span className={styles.churchHero__rule} />
          <span className={styles.churchHero__eyebrowText}>
            Kabulengwa Seventh-day Adventist Church
          </span>
        </div>

        <h1 className={styles.churchHero__heading}>
          Proclaiming the{" "}
          <span className={styles.churchHero__headingAccent}>Everlasting</span>{" "}
          Gospel
        </h1>

        <p className={styles.churchHero__body}>
          Join a community rooted in Scripture, united in love, and devoted to
          preparing hearts for the soon return of Jesus Christ.</p>

        <div className={styles.churchHero__actions}>
          <Button
            as={Link}
            to="/about"
            kind="primary"
            renderIcon={ArrowRight}
            className={styles.churchBtnNavy}
          >
            Our Story
          </Button>
          <Button
            kind="ghost"
            renderIcon={PlayFilledAlt}
            className={styles.churchBtnOutline}
          >
            Watch Last Sermon
          </Button>
        </div>

        <blockquote className={styles.churchHero__verse}>
          <p>
            "And I saw another angel fly in the midst of heaven, having the
            everlasting gospel to preach unto them that dwell on the earth…"
          </p>
          <cite>Revelation 14:6</cite>
        </blockquote>
      </Column>
    </Grid>

    <div className={styles.churchHero__goldStrip} aria-hidden="true" />
  </section>
);

export default Hero;
