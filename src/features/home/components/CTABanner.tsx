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
          Plan Your First Visit
        </h2>
        <p className={styles.churchCta__body}>
          Service times, parking, and what to expect — everything you need for
          your first Sabbath with us.
        </p>
        <div className={styles.churchCta__actions}>
          <Button
            as={Link}
            to="/contact"
            kind="primary"
            renderIcon={ArrowRight}
            className={styles.churchBtnPrimary}
          >
            Plan Your Visit
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
