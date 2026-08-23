import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../../auth/context/AuthContext";

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(displayName: string | null | undefined): string {
  if (!displayName) return "there";
  const first = displayName.trim().split(/\s+/)[0];
  return first || "there";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

interface DashboardHeroProps {
  /** Optional right-aligned actions, e.g. the Create Account button. */
  actions?: ReactNode;
}

export function DashboardHero({ actions }: DashboardHeroProps) {
  const { user } = useAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = getGreeting(now);
  const firstName = getFirstName(user?.displayName);

  const formattedDate = new Intl.DateTimeFormat("en-UG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <section className="dashboard-hero" aria-label="Welcome banner">
      <div className="dashboard-hero__copy">
        <p className="dashboard-hero__eyebrow">
          <span className="dashboard-hero__live-dot" aria-hidden="true" />
          Kabulengwa SDA Church · Live overview
        </p>
        <h1 className="dashboard-hero__title">
          {greeting}, {firstName} — welcome back.
        </h1>
        <p className="dashboard-hero__subtitle">
          Here&apos;s what&apos;s happening across the congregation today.
        </p>
      </div>

      <div className="dashboard-hero__side">
        <div className="dashboard-hero__clock" aria-hidden="true">
          <span className="dashboard-hero__time">{clock}</span>
          <span className="dashboard-hero__date">{formattedDate}</span>
        </div>
        {actions && (
          <div className="dashboard-hero__actions">{actions}</div>
        )}
      </div>
    </section>
  );
}