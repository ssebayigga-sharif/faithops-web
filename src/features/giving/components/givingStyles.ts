import type { CSSProperties } from "react";

/** Shared inline tokens using Carbon CSS custom properties for dark mode support */
export const colors = {
  text: "var(--cds-text-primary, #161616)",
  textSecondary: "var(--cds-text-secondary, #525252)",
  textMuted: "var(--cds-text-helper, #6f6f6f)",
  border: "var(--cds-border-subtle-01, #e0e0e0)",
  pageBg: "var(--cds-background, #f4f4f4)",
  white: "var(--cds-layer-01, #ffffff)",
  brand: "#0f2d52",
  interactive: "#0f62fe",
  success: "#198038",
} as const;

export const pageShell: CSSProperties = {
  fontFamily: "'IBM Plex Sans', sans-serif",
  background: colors.pageBg,
  minHeight: "100vh",
};

export const pageInner: CSSProperties = {
  padding: "1.5rem",
  /** Padding is overridden responsively by .giving-page__inner class in globals.css */
};

export const pageTitle: CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: colors.text,
  margin: "0 0 4px",
};

export const pageSubtitle: CSSProperties = {
  margin: 0,
  fontSize: "13px",
  color: colors.textMuted,
};

export const sectionTitle: CSSProperties = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 600,
  color: colors.text,
};

export const sectionDesc: CSSProperties = {
  margin: 0,
  fontSize: "13px",
  color: colors.textSecondary,
};

export const labelCaps: CSSProperties = {
  fontSize: "11px",
  color: colors.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

export const tileSection: CSSProperties = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
};

export const flexRowWrap: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "flex-start",
};

export const flexBetween: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "0.5rem",
};

export function statCardStyle(accent: string): CSSProperties {
  return {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid ${accent}`,
    padding: "0.85rem 1.1rem",
    height: "100%",
  };
}

export const scriptureTrigger: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: "none",
  background: "transparent",
  color: colors.interactive,
  cursor: "pointer",
};
