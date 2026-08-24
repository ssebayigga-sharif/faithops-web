import React from "react";
import styles from "./HomePage.module.scss";
import HomeHeader from "../components/HomeHeader";
import WelcomeBanner from "../components/WelcomeBanner";

const HomePage: React.FC = () => (
  <div className={styles.pageShell}>
    <HomeHeader />
    <main className={styles.pageEnter}>
      <WelcomeBanner />
    </main>
  </div>
);

export default HomePage;