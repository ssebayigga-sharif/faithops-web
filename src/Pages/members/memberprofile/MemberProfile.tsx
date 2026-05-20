
import {
  Tag,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  IconButton,
} from "@carbon/react";
import {
  Close,
  Edit,
  Phone,
  Email,
  
} from "@carbon/icons-react";
import type { Member, DrawerTab } from "@/churchTypes/memberTypes";
import {
  getStatusColor,
} from "@/utils/memberUtils";
import TimelineTab from "./TimelineTab";
import AttendanceTab from "./AttendaceTab";
import GivingTab from "./GivingTab";
import FamilyTab from "./FamilyTab";
import MinistriesTab from "./MinistriesTab";
import FollowUpTab from "./FollowupTab";
import NotesTab from "./NotesTab";
import OverviewTab from "./OverviewTab";
import styles from "./memberProfile.module.scss";


// ─── Props ────────────────────────────────────────────────────────────────────

interface MemberProfileProps {
  member: Member;
  onClose: () => void;
  onEdit?: (member: Member) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#0f2d52",
  "#c6971a",
  "#198038",
  "#6929c4",
  "#9f1853",
  "#005d5d",
  "#1192e8",
];

function getAvatarColor(id: string): string {
  const num = parseInt(id.replace(/\D/g, ""), 10) || 0;
  return AVATAR_COLORS[num % AVATAR_COLORS.length];
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MemberProfile({ member, onClose, onEdit }: MemberProfileProps) {
  const c = member._computed;
  const color = getAvatarColor(member.id);
  const initials = c?.initials ?? `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();

  const TAB_ORDER: DrawerTab[] = [
    "overview",
    "attendance",
    "giving",
    "family",
    "ministries",
    "followup",
    "notes",
    "timeline",
  ];

  const TAB_LABELS: Record<DrawerTab, string> = {
    overview: "Overview",
    attendance: "Attendance",
    giving: "Giving",
    family: "Family",
    ministries: "Ministries",
    followup: "Follow-Up",
    notes: "Notes",
    timeline: "Timeline",
  };

  return (
    <aside
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        style={{ flex: 1, background: "rgba(0,0,0,0.4)", cursor: "pointer" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        style={{
          width: 520,
          background: "white",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#0f2d52",
            padding: "1.5rem",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Avatar */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: color,
                  border: "3px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 20,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div>
                <p style={{ color: "white", fontSize: "18px", fontWeight: 700, marginBottom: 4 }}>
                  {c?.fullName ?? `${member.firstName} ${member.lastName}`}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Tag type={getStatusColor(member.status)} size="sm">
                    {member.status}
                  </Tag>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>
                    {member.id} · {member.cellGroup}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {onEdit && (
                <IconButton
                  label="Edit member"
                  kind="ghost"
                  size="sm"
                  onClick={() => onEdit(member)}
                  style={{ color: "white" }}
                >
                  <Edit size={16} />
                </IconButton>
              )}
              <IconButton
                label="Close panel"
                kind="ghost"
                size="sm"
                onClick={onClose}
                style={{ color: "white" }}
              >
                <Close size={16} />
              </IconButton>
            </div>
          </div>

          {/* Quick contact */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                  textDecoration: "none",
                }}
              >
                <Phone size={14} /> {member.phone}
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                  textDecoration: "none",
                }}
              >
                <Email size={14} /> {member.email}
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Tabs>
            <TabList
              aria-label="Member profile tabs"
              contained
              style={{ overflowX: "auto" }}
            >
              {TAB_ORDER.map((tab) => (
                <Tab key={tab}>{TAB_LABELS[tab]}</Tab>
              ))}
            </TabList>
<div className={styles.memberTabsContent}> 
            <TabPanels >
              <TabPanel><OverviewTab member={member} /></TabPanel>
              <TabPanel><AttendanceTab member={member} /></TabPanel>
              <TabPanel><GivingTab member={member} /></TabPanel>
              <TabPanel><FamilyTab member={member} /></TabPanel>
              <TabPanel><MinistriesTab member={member} /></TabPanel>
              <TabPanel><FollowUpTab member={member} /></TabPanel>
              <TabPanel><NotesTab member={member} /></TabPanel>
              <TabPanel><TimelineTab member={member} /></TabPanel>
            </TabPanels>
            </div>
          </Tabs>
        </div>
      </div>
    </aside>
  );
}