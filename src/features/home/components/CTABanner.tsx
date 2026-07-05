import React from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Button } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import styles from "../homepage.module.scss";

const CTABanner: React.FC = () => (
  <section className={styles.churchCta} aria-labelledby="cta-heading">
    <Grid>
      <Column lg={8} md={6} sm={4} className={styles.churchCta__content}>
        <h2 id="cta-heading" className={styles.churchCta__heading}>
          Join Us This Sabbath
        </h2>
        <p className={styles.churchCta__body}>
          Come for Bible study, worship, prayer, and fellowship. Members and
          visitors are welcome.
        </p>
        <div className={styles.churchCta__actions}>
          <Button
            as={Link}
            to="/contact"
            kind="primary"
            renderIcon={ArrowRight}
            className={styles.churchBtnPrimary}
          >
            Contact the Church
          </Button>
          <Button
            as={Link}
            to="/about"
            kind="tertiary"
            renderIcon={ArrowRight}
            className={styles.churchBtnOutline}
          >
            Learn About Us
          </Button>
        </div>
      </Column>
    </Grid>
  </section>
);

export default CTABanner;
