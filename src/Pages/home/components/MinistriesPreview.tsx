import React from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Button, ClickableTile } from "@carbon/react";
import { ArrowRight, User } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import { MINISTRIES } from "../church";
import { useFadeIn } from "../useFadeIn";
import type { Ministry } from "../index";

const MinistriesPreview: React.FC = () => {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`${styles.churchSection} ${styles.churchSectionWhite}`}
      aria-labelledby="ministries-heading"
    >
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div data-animate className={`${styles.fadeUp} ${styles.churchSectionHeader} ${styles.churchSectionHeaderCenter}`}>
            <span className={styles.churchGoldRuleCenter} aria-hidden="true" />
            <h2 id="ministries-heading">Ministries &amp; Departments</h2>
            <p className={`${styles.churchSectionSubhead} ${styles.churchSectionSubheadCenter}`}>
              Every member is a minister. Find your place in God's work.
            </p>
          </div>
        </Column>

        {MINISTRIES.map((m: Ministry, i: number) => (
          <Column key={m.id} lg={4} md={4} sm={4}>
            <div data-animate className={styles.fadeUp} style={{ transitionDelay: `${i * 0.07}s` }}>
              <ClickableTile className={styles.churchMinistryTile}>
                <span className={styles.churchMinistryTile__icon} role="img" aria-label={m.name}>
                  {m.icon}
                </span>
                <h3 className={styles.churchMinistryTile__name}>{m.name}</h3>
                <span className={styles.churchMinistryTile__leader}>
                  <User size={12} /> {m.leader}
                </span>
                <p className={styles.churchMinistryTile__desc}>{m.description}</p>
              </ClickableTile>
            </div>
          </Column>
        ))}

        <Column lg={16} md={8} sm={4}>
          <div data-animate className={`${styles.fadeUp} ${styles.churchMinistries}`}>
            <Button
              as={Link}
              to="/ministries"
              kind="primary"
              renderIcon={ArrowRight}
              className={styles.churchBtnNavy}
            >
              Explore All Ministries
            </Button>
          </div>
        </Column>
      </Grid>
    </section>
  );
};

export default MinistriesPreview;
