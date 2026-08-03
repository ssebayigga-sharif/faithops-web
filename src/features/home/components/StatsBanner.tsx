import React from "react";
import { Grid, Column } from "@carbon/react";
import styles from "../homepage.module.scss";
import { STATS } from "../data/home";
import type { StatItem } from "../types";

const StatsBanner: React.FC = () => (
    <section
      className={`${styles.churchSection} ${styles.churchStats}`}
      aria-label="Church statistics"
    >
      <Grid>
        {STATS.map((stat: StatItem) => (
          <Column key={stat.label} lg={4} md={4} sm={2}>
            <div className={styles.fadeUp}>
              <div className={styles.churchStat}>
                <span className={styles.churchStat__value}>{stat.value}</span>
                <span className={styles.churchStat__label}>{stat.label}</span>
                <span className={styles.churchStat__detail}>{stat.detail}</span>
              </div>
            </div>
          </Column>
        ))}
      </Grid>
    </section>
);

export default StatsBanner;
