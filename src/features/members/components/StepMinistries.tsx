import { Add, TrashCan } from "@carbon/icons-react";
import { Button, Select, SelectItem, Stack, Tag } from "@carbon/react";
import type { MiniAssignmentDraft } from "../types";
import {
  MINISTRIES_LIST,
  MINISTRY_ROLES,
} from "../utils/memberUtils";
import styles from "./MemberModal.module.scss";

interface StepMinistriesProps {
  ministries: MiniAssignmentDraft[];
  addMinistry: () => void;
  removeMinistry: (i: number) => void;
  updateMinistry: (
    i: number,
    key: keyof MiniAssignmentDraft,
    value: string,
  ) => void;
}

export function StepMinistries({
  ministries,
  addMinistry,
  removeMinistry,
  updateMinistry,
}: StepMinistriesProps) {
  return (
    <Stack gap={5}>
      <p className={styles.helperText}>
        Assign this member to one or more ministries (optional — can be updated
        later).
      </p>

      {ministries.map((m, i) => (
        <div key={i} className={styles.ministryRow}>
          <Select
            id={`min-ministry-${i}`}
            labelText="Ministry"
            value={m.ministry}
            onChange={(e) => updateMinistry(i, "ministry", e.target.value)}
          >
            {MINISTRIES_LIST.map((min) => (
              <SelectItem key={min} value={min} text={min} />
            ))}
          </Select>

          <Select
            id={`min-role-${i}`}
            labelText="Role"
            value={m.role}
            onChange={(e) => updateMinistry(i, "role", e.target.value)}
          >
            {MINISTRY_ROLES.map((r) => (
              <SelectItem key={r} value={r} text={r} />
            ))}
          </Select>

          <Button
            kind="ghost"
            size="md"
            hasIconOnly
            renderIcon={TrashCan}
            iconDescription="Remove"
            onClick={() => removeMinistry(i)}
            className={styles.removeButton}
          />
        </div>
      ))}

      <Button kind="tertiary" renderIcon={Add} size="sm" onClick={addMinistry}>
        Add Ministry Assignment
      </Button>

      {ministries.length > 0 && (
        <div className={styles.ministryTags}>
          {ministries.map((m, i) => (
            <Tag key={i} type="blue" size="md">
              {m.ministry} · {m.role}
            </Tag>
          ))}
        </div>
      )}
    </Stack>
  );
}
