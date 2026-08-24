import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./WelcomeBanner.module.scss";
import { useAuth } from "../../auth/context/AuthContext";
import { SITE_CONFIG } from "../data/site";

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  const name = displayName?.trim() || email?.split("@")[0]?.trim();
  return name?.split(/\s+/)[0] || "friend";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

const WelcomeBanner = () => {
  const { user } = useAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = getGreeting(now);
  const firstName = getFirstName(user?.displayName, user?.email);
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const formattedDate = new Intl.DateTimeFormat("en-UG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const SITE = SITE_CONFIG.shortName;

  return (
    <section className={styles.banner} aria-label="Welcome banner">
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.bgOverlay} aria-hidden="true" />
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          <span
            className={styles.eyebrowDot}
            aria-hidden="true"
          />
          {SITE_CONFIG.churchName}
        </p>

        {user ? (
          <>
            <h1 className={styles.title}>
              {greeting}, {firstName}.{" "}
              <span className={styles.titleAccent}>
                Welcome back.
              </span>
            </h1>
            <p className={styles.subtitle}>
              We&rsquo;re glad to see you at {SITE}. Here&rsquo;s what&rsquo;s
              happening across the congregation today.
            </p>
            <div className={styles.actions}>
              <Link className={styles.btnPrimary} to="/dashboard">
                Go to dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.title}>
              Welcome to{" "}
              <span className={styles.titleAccent}>
                {SITE_CONFIG.churchName}
              </span>
            </h1>
            <p className={styles.subtitle}>
              {SITE_CONFIG.tagline}.
            </p>
            <div className={styles.actions}>
              <Link className={styles.btnPrimary} to="/signup">
                Sign up
              </Link>
              <Link className={styles.btnGhost} to="/login">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>

      <div className={styles.side}>
        <div className={styles.clock} aria-hidden="true">
          <span className={styles.time}>{clock}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;
