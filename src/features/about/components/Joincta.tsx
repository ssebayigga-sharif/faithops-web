import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@carbon/react";
import { ArrowRight, Home } from "@carbon/icons-react";
import styles from "../about.module.scss";

const JoinCTA: React.FC = () => (
  <section className={styles["join-cta"]} aria-labelledby="join-cta-heading">
    <div className={styles["join-cta__inner"]}>
      <h2 id="join-cta-heading" className={styles["join-cta__heading"]}>
        Come Worship With Us This Sabbath
      </h2>

      <p className={styles["join-cta__body"]}>
        We gather every Saturday at 9:00&nbsp;AM for Sabbath School and
        11:00&nbsp;AM for Divine Worship. New faces are always welcome — come as
        you are.
      </p>

      <div className={styles["join-cta__actions"]}>
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
