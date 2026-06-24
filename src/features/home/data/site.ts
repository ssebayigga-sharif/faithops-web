export const SITE_CONFIG = {
  churchName: "Kabulengwa Seventh-day Adventist Church",
  /** Used wherever space is tight: nav, footer, mobile header */
  shortName: "Kabulengwa SDA",
  tagline: "A family of believers devoted to Scripture and united in Christ",
} as const;

export type SiteConfig = typeof SITE_CONFIG;
