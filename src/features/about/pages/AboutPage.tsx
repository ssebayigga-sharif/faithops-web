import React from "react";
import styles from "../about.module.scss";
import { LEADERS, BELIEFS } from "../../home/data/about";
import {
  AboutHero,
  MissionSection,
  HistorySection,
  DistinctivesSection,
  BeliefsSection,
  LeadershipSection,
  JoinCTA,
} from "../index";

const AboutPage: React.FC = () => (
  <main className={styles.pageEnter} id="main-content">
    <AboutHero />
    <MissionSection />
    <HistorySection />
    <DistinctivesSection />
    <BeliefsSection beliefs={BELIEFS} />
    <LeadershipSection leaders={LEADERS} />
    <JoinCTA />
  </main>
);

export default AboutPage;
