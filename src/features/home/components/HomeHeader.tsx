import { Link } from "react-router-dom";
import styles from "./HomeHeader.module.scss";
import ChurchIcon from "../../../shared/layouts/ChurchIcon";
import { SITE_CONFIG } from "../data/site";

const HomeHeader = () => (
  <header className={styles.header}>
    <Link
      className={styles.brand}
      to="/"
      aria-label="Kabulengwa SDA home"
    >
      <ChurchIcon size={40} />
      <span className={styles.brandText}>
        <strong>{SITE_CONFIG.shortName}</strong>
        <small>{SITE_CONFIG.tagline}</small>
      </span>
    </Link>

    <nav className={styles.actions} aria-label="Account actions">
      <Link className={styles.actionGhost} to="/login">
        Sign in
      </Link>
      <Link className={styles.actionPrimary} to="/signup">
        Sign up
      </Link>
    </nav>
  </header>
);

export default HomeHeader;
