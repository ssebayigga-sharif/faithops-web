import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Button, ContentSwitcher, Switch, InlineNotification } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import { FEATURED_SERMONS } from "@/features/home/data/home";
import { useFadeIn } from "../useFadeIn";
import SermonCardItem from "./SermonCard";

const ALL_LABEL = "All";

const SermonsSection: React.FC = () => {
  const ref = useFadeIn<HTMLElement>();

  const tags = useMemo(
    () => [ALL_LABEL, ...Array.from(new Set(FEATURED_SERMONS.map((s) => s.tag)))],
    []
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const activeTag = tags[activeIdx];
  const filtered = activeTag === ALL_LABEL
    ? FEATURED_SERMONS
    : FEATURED_SERMONS.filter((s) => s.tag === activeTag);

  const handleSwitch = useCallback((info: { index?: number; name?: string | number; text?: string }) => {
    if (info.index !== undefined) {
      setActiveIdx(info.index);
    }
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.churchSection} ${styles.churchSectionCream}`}
      aria-labelledby="sermons-heading"
    >
      <Grid>
        <Column lg={10} md={5} sm={4}>
          <div data-animate className={styles.fadeUp}>
            <span className={styles.churchGoldRule} aria-hidden="true" />
            <h2 id="sermons-heading" className={styles.churchSectionHeader__title}>Recent Sermons</h2>
            <p className={styles.churchSectionSubhead}>
              Faith comes by hearing — listen and grow.
            </p>
          </div>
        </Column>

        <Column lg={6} md={3} sm={4} className={styles.churchSermons}>
          <div data-animate className={styles.fadeUp}>
            <Button
              as={Link}
              to="/sermons"
              kind="ghost"
              renderIcon={ArrowRight}
              className={styles.churchBtnOutline}
              size="sm"
            >
              All Sermons
            </Button>
          </div>
        </Column>

        {tags.length > 2 && (
          <Column lg={16} md={8} sm={4}>
            <div data-animate className={styles.fadeUp}>
              <ContentSwitcher
                onChange={handleSwitch}
                selectedIndex={activeIdx}
                size="sm"
                className={styles.churchSermons__switcher}
              >
                {tags.map((tag) => (
                  <Switch key={tag} name={tag} text={tag} />
                ))}
              </ContentSwitcher>
            </div>
          </Column>
        )}

        {filtered.length === 0 ? (
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="info"
              title="No sermons found"
              subtitle="Try a different filter."
              lowContrast
              hideCloseButton
            />
          </Column>
        ) : (
          filtered.map((s, i) => (
            <Column key={s.id} lg={4} md={4} sm={4}>
              <div data-animate className={styles.fadeUp} style={{ transitionDelay: `${i * 0.08}s` }}>
                <SermonCardItem sermon={s} />
              </div>
            </Column>
          ))
        )}
      </Grid>
    </section>
  );
};

export default SermonsSection;
