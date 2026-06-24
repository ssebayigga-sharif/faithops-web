import React from "react";
import { Grid, Column, Accordion, AccordionItem, Tag } from "@carbon/react";
import styles from "../about.module.scss";
import type { BeliefItem } from "@/features/home/types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface BeliefsSectionProps {
  /** Array of beliefs to render — typically imported from church.ts */
  beliefs: BeliefItem[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────
interface BeliefTitleProps {
  belief: BeliefItem;
}

/**
 * Extracted so AccordionItem title prop stays clean and testable independently.
 */
const BeliefTitle: React.FC<BeliefTitleProps> = ({ belief }) => (
  <span className={styles["belief-title"]}>
    <span className={styles["belief-title__number"]} aria-hidden>
      {belief.number}
    </span>
    <span className={styles["belief-title__text"]}>{belief.title}</span>
  </span>
);

interface BeliefContentProps {
  belief: BeliefItem;
}

const BeliefContent: React.FC<BeliefContentProps> = ({ belief }) => (
  <div className={styles["belief-content"]}>
    <p className={styles["belief-content__summary"]}>{belief.summary}</p>
    <Tag
      type="gray"
      className={styles["belief-content__scripture-tag"]}
      aria-label={`Scripture reference: ${belief.scripture}`}
    >
      📖 {belief.scripture}
    </Tag>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const BeliefsSection: React.FC<BeliefsSectionProps> = ({ beliefs }) => {
  return (
    <section
      className={`${styles.sectionGold} ${styles["beliefs-section"]}`}
      aria-labelledby="beliefs-heading"
    >
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className={styles["section-header"]}>
            <div className={styles.goldRule} aria-hidden />
            <h2 id="beliefs-heading" className={styles["section-heading"]}>
              Fundamental Beliefs
            </h2>
            <p className={styles["section-lead"]}>
              The SDA Church has 28 Fundamental Beliefs, each drawn solely from
              Scripture. Below are a selection central to our identity.
            </p>
          </div>
        </Column>

        <Column sm={4} md={8} lg={12}>
          <Accordion className={styles["beliefs-accordion"]}>
            {beliefs.map((belief) => (
              <AccordionItem
                key={belief.number}
                title={<BeliefTitle belief={belief} />}
                className={styles["beliefs-accordion__item"]}
              >
                <BeliefContent belief={belief} />
              </AccordionItem>
            ))}
          </Accordion>
        </Column>

        <Column sm={4} md={8} lg={16}>
          <div className={styles["beliefs-section__cta"]}>
            <a
              href="https://www.adventist.org/beliefs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["btn-church-outline"]}
            >
              All 28 Beliefs → adventist.org
            </a>
          </div>
        </Column>
      </Grid>
    </section>
  );
};

export default BeliefsSection;
