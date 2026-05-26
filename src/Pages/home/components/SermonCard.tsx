import React from "react";
import { Tag, ClickableTile, AspectRatio } from "@carbon/react";
import { PlayFilledAlt, Calendar, User } from "@carbon/icons-react";
import styles from "../homepage.module.scss";
import type { SermonCard as SermonCardType } from "../index";

const SERMON_TAG_TYPE: Record<string, "red" | "magenta" | "purple" | "blue" | "cyan" | "teal" | "green" | "gray"> = {
  Featured: "purple",
  Recent: "teal",
  Series: "blue",
  Youth: "green",
  default: "gray",
};

const SermonCardItem: React.FC<{ sermon: SermonCardType }> = ({ sermon }) => (
  <ClickableTile
    className={styles.churchSermonTile}
    aria-label={`Watch ${sermon.title} by ${sermon.speaker}`}
  >
    <AspectRatio ratio="16x9" className={styles.churchSermonTile__thumb}>
      <div className={styles.churchSermonTile__play} aria-hidden="true">
        <PlayFilledAlt size={24} />
      </div>

      <div className={styles.churchSermonTile__overlayTop}>
        <Tag type={SERMON_TAG_TYPE[sermon.tag] ?? SERMON_TAG_TYPE.default} size="sm">
          {sermon.tag}
        </Tag>
      </div>

      <span className={styles.churchSermonTile__duration}>{sermon.duration}</span>
    </AspectRatio>

    <div className={styles.churchSermonTile__body}>
      <span className={styles.churchSermonTile__scripture}>{sermon.scripture}</span>
      <h3 className={styles.churchSermonTile__title}>{sermon.title}</h3>
      <div className={styles.churchSermonTile__meta}>
        <span>
          <User size={12} /> {sermon.speaker}
        </span>
        <span>
          <Calendar size={12} /> {sermon.date}
        </span>
      </div>
    </div>
  </ClickableTile>
);

export default React.memo(SermonCardItem);
