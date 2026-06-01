import React, { useState } from "react";
import { TextInput, Tag, Button, Tile } from "@carbon/react";
import { Add, Favorite } from "@carbon/icons-react";
import type { ChurchProfile } from "@/features/profile/types";

// ── TagSelector ───────────────────────────────────────────────
interface TagSelectorProps {
  label: string;
  selected: string[];
  presets: string[];
  placeholder: string;
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  label,
  selected,
  presets,
  placeholder,
  onAdd,
  onRemove,
}) => {
  const [input, setInput] = useState("");
  const unselected = presets.filter((p) => !selected.includes(p));

  const commit = () => {
    const v = input.trim();
    if (v && !selected.includes(v)) onAdd(v);
    setInput("");
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p className="role-tags__label">{label}</p>

      {selected.length > 0 && (
        <div className="role-tags">
          {selected.map((item) => (
            <Tag
              key={item}
              type="blue"
              filter
              onClose={() => onRemove(item)}
              title={`Remove ${item}`}
            >
              {item}
            </Tag>
          ))}
        </div>
      )}

      {unselected.length > 0 && (
        <div className="role-tags">
          {unselected.map((item) => (
            <Tag
              key={item}
              type="gray"
              onClick={() => onAdd(item)}
              style={{ cursor: "pointer" }}
              title={`Add ${item}`}
            >
              + {item}
            </Tag>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", maxWidth: "400px" }}>
        <TextInput
          id={`ts-${label.replace(/\s+/g, "-")}`}
          labelText=""
          hideLabel
          size="sm"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit())}
        />
        <Button
          kind="tertiary"
          size="sm"
          renderIcon={Add}
          iconDescription="Add"
          hasIconOnly
          onClick={commit}
          disabled={!input.trim()}
        />
      </div>
    </div>
  );
};

// ── MinistrySection ───────────────────────────────────────────
const PRESET_ROLES = [
  "Worship Leader",
  "Choir Member",
  "Usher",
  "Sunday School Teacher",
  "Cell Group Leader",
  "Evangelist",
  "Prayer Team",
  "Media Team",
  "Finance Committee",
  "Deacon",
  "Elder",
  "Youth Leader",
];
const PRESET_GIFTS = [
  "Teaching",
  "Prophecy",
  "Healing",
  "Mercy",
  "Giving",
  "Administration",
  "Evangelism",
  "Exhortation",
  "Leadership",
  "Service",
  "Faith",
  "Wisdom",
];

interface Props {
  profile: ChurchProfile;
  onChange: <K extends keyof ChurchProfile>(
    field: K,
    value: ChurchProfile[K],
  ) => void;
}

export const MinistrySection: React.FC<Props> = ({ profile, onChange }) => {
  const add = (field: "ministryRoles" | "spiritualGifts") => (v: string) =>
    onChange(field, [...profile[field], v]);
  const remove = (field: "ministryRoles" | "spiritualGifts") => (v: string) =>
    onChange(
      field,
      profile[field].filter((x) => x !== v),
    );

  return (
    <Tile className="profile-section">
      <h2 className="profile-section__heading">
        <Favorite size={20} aria-hidden /> Ministry &amp; Vocation
      </h2>

      <TagSelector
        label="Ministry Roles"
        selected={profile.ministryRoles}
        presets={PRESET_ROLES}
        placeholder="Add custom role…"
        onAdd={add("ministryRoles")}
        onRemove={remove("ministryRoles")}
      />
      <TagSelector
        label="Spiritual Gifts"
        selected={profile.spiritualGifts}
        presets={PRESET_GIFTS}
        placeholder="Add spiritual gift…"
        onAdd={add("spiritualGifts")}
        onRemove={remove("spiritualGifts")}
      />

      <div className="profile-field-grid" style={{ marginTop: "0.5rem" }}>
        <TextInput
          id="v-occupation"
          labelText="Occupation / Profession"
          placeholder="e.g. Teacher, Engineer"
          value={profile.occupation}
          onChange={(e) => onChange("occupation", e.target.value)}
        />
        <TextInput
          id="v-employer"
          labelText="Employer / Business"
          placeholder="e.g. Ministry of Education"
          value={profile.employer}
          onChange={(e) => onChange("employer", e.target.value)}
        />
      </div>
    </Tile>
  );
};
