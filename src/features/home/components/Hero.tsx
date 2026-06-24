import React from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Button } from "@carbon/react";
import { ArrowRight, Favorite } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import { SITE_CONFIG } from "../data/site";

const Hero: React.FC = () => (
  <section className={styles.churchHero}>
    <Grid className={styles.churchHero__grid}>
      <Column lg={8} md={6} sm={4}>
        <div className={styles.churchHero__eyebrow}>
          <span className={styles.churchHero__rule} />
          <span className={styles.churchHero__eyebrowText}>
            {SITE_CONFIG.churchName}
          </span>
        </div>

        <h1 className={styles.churchHero__heading}>
          Welcome in the Name of{" "}
          <span className={styles.churchHero__headingAccent}>Jesus Christ</span>
        </h1>

        <p className={styles.churchHero__body}>
          Grace and peace be multiplied unto you through the knowledge of God
          and of our Lord Jesus Christ. We are a family of believers devoted to
          Scripture, united in Christ's love, and eagerly awaiting His soon
          return. Whether you are a long-time member or visiting for the first
          time, you are welcome here.
        </p>

        <div className={styles.churchHero__actions}>
          <Button
            as={Link}
            to="/about"
            kind="primary"
            renderIcon={ArrowRight}
            className={styles.churchBtnPrimary}
          >
            Learn Our Story
          </Button>
          <Button
            as={Link}
            to="/contact"
            kind="ghost"
            renderIcon={Favorite}
            className={styles.churchBtnOutline}
          >
            Get In Touch
          </Button>
        </div>

        <blockquote className={styles.churchHero__verse}>
          <p>
            &ldquo;For God so loved the world that He gave His only begotten
            Son, that whoever believes in Him should not perish but have
            everlasting life.&rdquo;
          </p>
          <cite>John 3:16</cite>
        </blockquote>
      </Column>
    </Grid>
  </section>
);

export default Hero;
