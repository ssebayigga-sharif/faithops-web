import React from "react";
import { Grid, Column, Tile } from "@carbon/react";
import styles from "../homepage.module.scss";
import { SERVICE_TIMES } from "../data/home";
import { SITE_CONFIG } from "../data/site";
import type { ServiceTime } from "../types";

const ServiceTimes: React.FC = () => (
    <section
      className={`${styles.churchSection} ${styles.churchSectionWhite}`}
      aria-labelledby="services-heading"
    >
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div className={`${styles.churchSectionHeader} ${styles.fadeUp}`}>
            <span className={styles.churchGoldRule} aria-hidden="true" />
            <h2 id="services-heading">Join Us for Worship</h2>
            <p className={styles.churchSectionSubhead}>
              All services are held at {SITE_CONFIG.shortName}. Everyone is
              welcome.
            </p>
          </div>
        </Column>

        {SERVICE_TIMES.map((s: ServiceTime) => (
          <Column key={s.name} lg={4} md={4} sm={4}>
            <div className={styles.fadeUp}>
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

export default ServiceTimes;
