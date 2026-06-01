import React from "react";
import { Grid, Column, Tile } from "@carbon/react";
import styles from "../homepage.module.scss";
import { SERVICE_TIMES } from "@/features/home/data/home";
import { useFadeIn } from "../useFadeIn";
import type { ServiceTime } from "@/features/home/types";

const ServiceTimes: React.FC = () => {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`${styles.churchSection} ${styles.churchSectionWhite}`}
      aria-labelledby="services-heading"
    >
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div data-animate className={`${styles.churchSectionHeader} ${styles.fadeUp}`}>
            <span className={styles.churchGoldRule} aria-hidden="true" />
            <h2 id="services-heading">Join Us for Worship</h2>
            <p className={styles.churchSectionSubhead}>
              All services are held at the Kabulengwa SDA Church. Everyone is welcome.
            </p>
          </div>
        </Column>

        {SERVICE_TIMES.map((s: ServiceTime, i: number) => (
          <Column key={s.name} lg={4} md={4} sm={4}>
            <div data-animate className={styles.fadeUp} style={{ transitionDelay: `${i * 0.1}s` }}>
              <Tile className={styles.churchServiceTile}>
                <span className={styles.churchServiceTile__day}>{s.day}</span>
                <p className={styles.churchServiceTileTime}>{s.time}</p>
                <p className={styles.churchServiceTileName}>{s.name}</p>
                <p className={styles.churchServiceTileDesc}>{s.description}</p>
              </Tile>
            </div>
          </Column>
        ))}
      </Grid>
    </section>
  );
};

export default ServiceTimes;
