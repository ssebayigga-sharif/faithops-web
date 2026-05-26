import React from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Button } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import styles from "../homepage.module.scss";

const CTABanner: React.FC = () => (
  <section className={styles.churchCta} aria-labelledby="cta-heading">
    <div className={styles.churchCta__pattern} aria-hidden="true" />

    <Grid className={styles.churchCta__grid}>
      <Column lg={8} md={6} sm={4} className={styles.churchCta__content}>
        <h2 id="cta-heading" className={styles.churchCta__heading}>
          New Here? We'd Love to Meet You.
        </h2>
        <p className={styles.churchCta__body}>
          Whether you're exploring faith or looking for a church home — you
          belong here. Come as you are.
        </p>
        <div className={styles.churchCta__actions}>
          <Button
            as={Link}
            to="/contact"
            kind="primary"
            renderIcon={ArrowRight}
            className={styles.churchCta__btnPrimary}
          >
            Plan Your Visit
          </Button>
          <Button
            as={Link}
            to="/about"
            kind="tertiary"
            renderIcon={ArrowRight}
            className={styles.churchCta__btnSecondary}
          >
            Learn About Us
          </Button>
        </div>
      </Column>
    </Grid>
  </section>
);

export default CTABanner;
