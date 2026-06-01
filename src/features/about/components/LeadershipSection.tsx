import React, { useState, useCallback } from "react";
import { Grid, Column, Tile, Button } from "@carbon/react";
import { ChevronDown, ChevronUp } from "@carbon/icons-react";
import { useFadeIn } from "@/features/home/useFadeIn";
import styles from "../about.module.scss";
import type { Leader } from "@/features/home/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const BIO_PREVIEW_LENGTH = 120;

// ─── Props ────────────────────────────────────────────────────────────────────
interface LeadershipSectionProps {
  leaders: Leader[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────
interface LeaderCardProps {
  leader: Leader;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const LeaderCard: React.FC<LeaderCardProps> = ({
  leader,
  isExpanded,
  onToggle,
}) => {
  const bioPreview = `${leader.bio.slice(0, BIO_PREVIEW_LENGTH)}…`;
  const bioId = `leader-bio-${leader.id}`;

  return (
    <Tile
      className={`${styles["leader-card"]} ${styles.fadeUp}`}
      aria-label={leader.name}
      data-animate
    >
      {/* ── Avatar header ── */}
      <header className={styles["leader-card__header"]}>
        <div
          className={styles["leader-card__avatar"]}
          aria-hidden
          role="presentation"
        >
          {leader.initials}
        </div>

        <div className={styles["leader-card__meta"]}>
          <h3 className={styles["leader-card__name"]}>{leader.name}</h3>
          <p className={styles["leader-card__title"]}>{leader.title}</p>
          <p className={styles["leader-card__tenure"]}>
            {leader.yearsServing} years of service
          </p>
        </div>
      </header>

      {/* ── Bio ── */}
      <div className={styles["leader-card__body"]}>
        <p
          id={bioId}
          className={styles["leader-card__bio"]}
          aria-live="polite"
        >
          {isExpanded ? leader.bio : bioPreview}
        </p>

        <Button
          kind="ghost"
          size="sm"
          className={styles["leader-card__toggle"]}
          onClick={() => onToggle(leader.id)}
          aria-expanded={isExpanded}
          aria-controls={bioId}
          renderIcon={isExpanded ? ChevronUp : ChevronDown}
          iconDescription={isExpanded ? "Show less" : "Read more"}
        >
          {isExpanded ? "Show less" : "Read more"}
        </Button>
      </div>
    </Tile>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const LeadershipSection: React.FC<LeadershipSectionProps> = ({ leaders }) => {
  const ref = useFadeIn();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /**
   * Toggle: collapse if already open, expand if closed.
   * useCallback so LeaderCard receives a stable reference.
   */
  const handleToggle = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  return (
    <section
      className={`${styles.sectionWhite} ${styles["leadership-section"]}`}
      ref={ref}
      aria-labelledby="leadership-heading"
    >
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div
            data-animate
            className={`${styles["section-header"]} ${styles["section-header--center"]} ${styles.fadeUp}`}
          >
            <div className={styles.goldRuleCenter} aria-hidden />
            <h2 id="leadership-heading" className={styles["section-heading"]}>
              Our Leadership
            </h2>
            <p className={styles["section-lead"]}>
              Servant leaders called to shepherd, teach, and guide our
              congregation.
            </p>
          </div>
        </Column>

        {leaders.map((leader) => (
          <Column key={leader.id} sm={4} md={4} lg={5}>
            <LeaderCard
              leader={leader}
              isExpanded={expandedId === leader.id}
              onToggle={handleToggle}
            />
          </Column>
        ))}
      </Grid>
    </section>
  );
};

export default LeadershipSection;
