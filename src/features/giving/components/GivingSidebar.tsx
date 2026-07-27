import { Stack, Tile } from "@carbon/react";
import { Finance } from "@carbon/icons-react";
import { formatUGX } from "../givingUtils";
import { colors, sectionDesc, tileSection } from "./givingStyles";

interface GivingSidebarProps {
  totalAmount: number;
  totalTithe: number;
  totalOfferings: number;
}

const CATEGORIES = [
  {
    title: "Tithe",
    desc: "10% of all income, returned to God — a recognition of His ownership.",
  },
  {
    title: "Offering",
    desc: "Freewill offering for local church operations and ministries.",
  },
  {
    title: "Building Fund",
    desc: "Contributions for maintaining and expanding the church sanctuary.",
  },
  {
    title: "Mission Fund",
    desc: "Supporting local and global evangelism efforts.",
  },
  {
    title: "Church lunch",
    desc: "Put in something for lunch .",
  },
];

export function GivingSidebar({
  totalAmount,
  totalTithe,
  totalOfferings,
}: GivingSidebarProps) {
  return (
    <Stack gap={4}>
      <Tile style={tileSection}>
        <Stack gap={3}>
          <h4
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Giving Categories
          </h4>
          <Stack gap={3}>
            {CATEGORIES.map((item) => (
              <Stack key={item.title} gap={1}>
                <strong style={{ fontSize: "13px" }}>{item.title}</strong>
                <p style={sectionDesc}>{item.desc}</p>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Tile>

      <Tile
        style={{
          ...tileSection,
          borderLeft: `3px solid ${colors.brand}`,
        }}
      >
        <Stack gap={2}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontStyle: "italic",
            }}
          >
            &ldquo;Each of you should give what you have decided in your heart
            to give, not reluctantly or under compulsion, for God loves a
            cheerful giver.&rdquo;
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: colors.textMuted,
            }}
          >
            — 2 Corinthians 9:7
          </p>
        </Stack>
      </Tile>

      {totalAmount > 0 && (
        <Tile
          style={{
            ...tileSection,
            borderLeft: `4px solid ${colors.interactive}`,
          }}
        >
          <Stack gap={2}>
            <span
              style={{
                fontSize: "11px",
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Current total
            </span>
            <strong
              style={{
                fontSize: "22px",
                color: colors.text,
              }}
            >
              {formatUGX(totalAmount)}
            </strong>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: colors.textMuted,
              }}
            >
              {totalTithe > 0 && `${formatUGX(totalTithe)} tithe`}
              {totalTithe > 0 && totalOfferings > 0 && " · "}
              {totalOfferings > 0 && `${formatUGX(totalOfferings)} offerings`}
            </p>
          </Stack>
        </Tile>
      )}
    </Stack>
  );
}
