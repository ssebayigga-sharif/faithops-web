import React from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Button } from "@carbon/react";
import { ArrowRight, Calendar } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import { SITE_CONFIG } from "../data/site";

const Hero: React.FC = () => (
  <section className={styles.churchHero}>
    <Grid className={styles.churchHero__grid}>
      <Column lg={8} md={6} sm={4}>
        <span className={styles.churchHero__eyebrowText}>
          {SITE_CONFIG.churchName}
        </span>

        <h1 className={styles.churchHero__heading}>
          Worshiping Christ, keeping the Sabbath, serving the community
        </h1>

        <p className={styles.churchHero__body}>
          We are a Seventh-day Adventist church family committed to Scripture,
          prayer, healthful living, discipleship, and the hope of Jesus Christ's
          soon return. Join us for Sabbath School, Divine Worship, and practical
          service in our community.
        </p>

        <div className={styles.churchHero__actions}>
          <Button
            as={Link}
            to="/about"
            kind="primary"
            renderIcon={ArrowRight}
            className={styles.churchBtnPrimary}
          >
            About Our Church
          </Button>
          <Button
            as="a"
            href="#services-heading"
            kind="ghost"
            renderIcon={Calendar}
            className={styles.churchBtnOutline}
          >
            Worship Times
          </Button>
        </div>

        <blockquote className={styles.churchHero__verse}>
          <p>
            &ldquo;Here are they that keep the commandments of God, and the faith
            of Jesus.&rdquo;
          </p>
          <cite>Revelation 14:12</cite>
        </blockquote>
      </Column>
    </Grid>
  </section>
);

export default Hero;
