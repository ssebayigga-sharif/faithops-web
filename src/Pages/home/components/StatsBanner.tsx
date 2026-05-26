import React, { useEffect, useState, useRef } from "react";
import { Grid, Column } from "@carbon/react";
import styles from "../homepage.module.scss";
import { STATS } from "../church";
import { useFadeIn } from "../useFadeIn";
import type { StatItem } from "../index";

const StatItemComponent: React.FC<{ stat: StatItem }> = ({ stat }) => {
  const [count, setCount] = useState("");
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rawValue = stat.value;
    const match = rawValue.replace(/,/g, "").match(/^([\d.]+)(.*)$/);
    if (!match) {
      setCount(rawValue);
      return;
    }

    const targetNum = parseFloat(match[1]);
    const suffix = match[2];
    const isDecimal = match[1].includes(".");

    let hasAnimated = false;

    const startAnimation = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      const start = 0;
      const duration = 1500; // 1.5s
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic: f(t) = t * (2 - t)
        const easeProgress = progress * (2 - progress);
        const currentNum = start + easeProgress * (targetNum - start);

        let formatted = "";
        if (isDecimal) {
          formatted = currentNum.toFixed(1);
        } else {
          formatted = Math.floor(currentNum).toLocaleString();
        }

        setCount(`${formatted}${suffix}`);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(rawValue); // Ensure exact final value
        }
      };

      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div className={styles.churchStat}>
      <span ref={elementRef} className={styles.churchStat__value}>{count || stat.value}</span>
      <span className={styles.churchStat__label}>{stat.label}</span>
      <span className={styles.churchStat__detail}>{stat.detail}</span>
    </div>
  );
};

const StatsBanner: React.FC = () => {
  const ref = useFadeIn<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`${styles.churchSection} ${styles.churchSectionNavy} ${styles.churchStats}`}
      aria-label="Church statistics"
    >
      <Grid>
        {STATS.map((stat: StatItem, i: number) => (
          <Column key={stat.label} lg={4} md={4} sm={2}>
            <div data-animate className={styles.fadeUp} style={{ transitionDelay: `${i * 0.12}s` }}>
              <StatItemComponent stat={stat} />
            </div>
          </Column>
        ))}
      </Grid>
    </section>
  );
};

export default StatsBanner;
