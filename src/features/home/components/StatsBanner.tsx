import React from "react";
import { Grid, Column } from "@carbon/react";
import styles from "../homepage.module.scss";
import { STATS } from "@/features/home/data/home";
import { useFadeIn } from "../useFadeIn";
import type { StatItem } from "@/features/home/types";

const StatsBanner: React.FC = () => {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`${styles.churchSection} ${styles.churchStats}`}
      aria-label="Church statistics"
    >
      <Grid>
        {STATS.map((stat: StatItem, i: number) => (
          <Column key={stat.label} lg={4} md={4} sm={2}>
            <div
              data-animate
              className={styles.fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
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
};

export default StatsBanner;
