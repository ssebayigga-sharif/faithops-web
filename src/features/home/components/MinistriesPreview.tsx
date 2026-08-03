import React from "react";
import { Grid, Column, Tile } from "@carbon/react";
import { User } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import { MINISTRIES } from "../data/home";
import type { HomeMinistry } from "../types";

const MinistriesPreview: React.FC = () => (
  <section
    className={`${styles.churchSection} ${styles.churchSectionWhite}`}
    aria-labelledby="ministries-heading"
  >
    <Grid>
      <Column lg={16} md={8} sm={4}>
        <div
          className={`${styles.fadeUp} ${styles.churchSectionHeader} ${styles.churchSectionHeaderCenter}`}
        >
          <h2 id="ministries-heading">Ministries &amp; Departments</h2>
        </div>
      </Column>

      {MINISTRIES.map((m: HomeMinistry) => (
        <Column key={m.id} lg={4} md={4} sm={4}>
          <div className={styles.fadeUp}>
            <Tile className={styles.churchMinistryTile}>
              <h3 className={styles.churchMinistryTile__name}>{m.name}</h3>
              <span className={styles.churchMinistryTile__leader}>
                <User size={12} /> {m.leader}
              </span>
              <p className={styles.churchMinistryTile__desc}>{m.description}</p>
            </Tile>
          </div>
        </Column>
      ))}
    </Grid>
  </section>
);

export default MinistriesPreview;
