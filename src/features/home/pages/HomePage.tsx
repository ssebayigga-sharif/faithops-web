import React from "react";
import styles from "../homepage.module.scss";
import Hero from "../components/Hero";
import ServiceTimes from "../components/ServiceTimes";
import StatsBanner from "../components/StatsBanner";
import SermonsSection from "../components/SermonsSection";
import MinistriesPreview from "../components/MinistriesPreview";
import EventsSection from "../components/EventsSection";
import CTABanner from "../components/CTABanner";

const HomePage: React.FC = () => (
  <main className={styles.pageEnter}>
    <Hero />
    <ServiceTimes />
    <StatsBanner />
    <SermonsSection />
    <MinistriesPreview />
    <EventsSection />
    <CTABanner />
  </main>
);

export default HomePage;
