import { Link } from "react-router-dom";
import styles from "../homepage.module.scss";
import ChurchIcon from "../../../shared/layouts/ChurchIcon";
import { SITE_CONFIG } from "../data/site";

const HomeHeader = () => (
  <header className={styles.homeHeader}>
    <Link
      className={styles.homeHeader__brand}
      to="/"
      aria-label="Kabulengwa SDA home"
    >
      <ChurchIcon size={40} />
      <span className={styles.homeHeader__brandText}>
        <strong>{SITE_CONFIG.shortName}</strong>
        <small>{SITE_CONFIG.tagline}</small>
      </span>
    </Link>

    <nav className={styles.homeHeader__actions} aria-label="Account actions">
      <Link className={styles.homeHeader__actionGhost} to="/login">
        Sign in
      </Link>
      <Link className={styles.homeHeader__actionPrimary} to="/signup">
        Sign up
      </Link>
    </nav>
  </header>
);

export default HomeHeader;
