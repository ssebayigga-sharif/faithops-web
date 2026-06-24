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

/**
 * AboutPage is a pure orchestration component.
 * It owns no local state — all data flows down via props.
 * Each section is independently importable and testable.
 */
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
