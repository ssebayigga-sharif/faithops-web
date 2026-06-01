import React, { useEffect, useRef } from "react";
import {
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Tag,
  InlineNotification,
  SkeletonText,
  SkeletonPlaceholder,
  Loading,
} from "@carbon/react";
import {
  Save,
  Reset,
  CheckmarkFilled,
  WarningAltFilled,
  ErrorFilled,
} from "@carbon/icons-react";

import { ProfileAvatar } from "../components/ProfileAvatar";
import { PersonalInfoSection } from "../components/PersonalInfoSection";
import { ContactInfoSection } from "../components/ContactInfoSection";
import { FamilySection } from "../components/FamilySection";
import { MembershipSection } from "../components/Membership";
import { MinistrySection } from "../components/Ministry";
import { useProfile } from "../hooks/useProfile";
import type { MembershipStatus } from "@/shared/types";

import styles from "../profile.module.scss";

interface Props {
  /** Firebase Auth UID of the logged-in user */
  uid?: string;
}

type MembershipBadgeType = "green" | "gray" | "teal" | "purple";

const BADGE_TYPES: Record<MembershipStatus, MembershipBadgeType> = {
  active: "green",
  inactive: "gray",
  visitor: "teal",
  transferred: "purple",
};

export const ProfilePage: React.FC<Props> = ({ uid }) => {
  const {
    profile,
    isDirty,
    saveStatus,
    errorMessage,
    isLoading,
    updateField,
    updateNestedField,
    saveProfile,
    loadProfile,
    resetProfile,
    updatePhoto,
  } = useProfile();

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uid) loadProfile(uid);
  }, [uid, loadProfile]);

  const fullName =
    [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ") || "New Member";

  const memberSince = profile.dateJoined
    ? new Date(profile.dateJoined).getFullYear()
    : null;

  const handleSave = async () => {
    await saveProfile();
    if (saveStatus === "error")
      topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Loading skeleton ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileHeader}>
          <Grid>
            <Column lg={16} md={8} sm={4}>
              <div className={styles.profileHeaderInner}>
                <SkeletonPlaceholder
                  style={{ width: 96, height: 96, borderRadius: "50%" }}
                />
                <div style={{ flex: 1 }}>
                  <SkeletonText heading width="40%" />
                  <SkeletonText width="25%" />
                </div>
              </div>
            </Column>
          </Grid>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage} ref={topRef}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className={styles.profileHeader}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className={styles.profileHeaderInner}>
              <ProfileAvatar
                photoUrl={profile.profilePhotoUrl}
                firstName={profile.firstName}
                lastName={profile.lastName}
                onPhotoChange={updatePhoto}
              />

              <div className={styles.profileHeaderMeta}>
                <h1 className={styles.profileHeaderName}>{fullName}</h1>
                <p className={styles.profileHeaderSubtitle}>
                  {profile.department
                    ? `${profile.department} Department`
                    : "Church Member"}
                  {profile.cellGroup ? ` · ${profile.cellGroup}` : ""}
                  {memberSince ? ` · Member since ${memberSince}` : ""}
                </p>

                <div className={styles.profileHeaderBadges}>
                  <Tag type={BADGE_TYPES[profile.membershipStatus] ?? "gray"}>
                    {profile.membershipStatus.charAt(0).toUpperCase() +
                      profile.membershipStatus.slice(1)}
                  </Tag>
                  {profile.baptismStatus === "baptised" && (
                    <Tag type="blue">Baptised</Tag>
                  )}
                  {profile.membershipNumber && (
                    <Tag type="outline">#{profile.membershipNumber}</Tag>
                  )}
                  {profile.ministryRoles.slice(0, 2).map((r) => (
                    <Tag key={r} type="purple">
                      {r}
                    </Tag>
                  ))}
                  {profile.ministryRoles.length > 2 && (
                    <Tag type="purple">
                      +{profile.ministryRoles.length - 2} more
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </Column>
        </Grid>
      </div>

      {/* ── Error notification ──────────────────────────────── */}
      {saveStatus === "error" && errorMessage && (
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="error"
              lowContrast
              title="Save failed: "
              subtitle={errorMessage}
              style={{ marginBottom: "1rem" }}
            />
          </Column>
        </Grid>
      )}

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div className={styles.profileNav}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Tabs>
              <TabList aria-label="Profile sections" contained>
                <Tab>Personal</Tab>
                <Tab>Contact</Tab>
                <Tab>Family</Tab>
                <Tab>Membership</Tab>
                <Tab>Ministry</Tab>
              </TabList>

              <Grid style={{ marginTop: "1.5rem", paddingBottom: "5rem" }}>
                <Column lg={16} md={8} sm={4}>
                  <TabPanels>
                    <TabPanel>
                      <PersonalInfoSection
                        profile={profile}
                        onChange={updateField}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ContactInfoSection
                        profile={profile}
                        onChange={updateField}
                      />
                    </TabPanel>
                    <TabPanel>
                      <FamilySection
                        profile={profile}
                        onChange={updateField}
                        onNestedChange={updateNestedField}
                      />
                    </TabPanel>
                    <TabPanel>
                      <MembershipSection
                        profile={profile}
                        onChange={updateField}
                      />
                    </TabPanel>
                    <TabPanel>
                      <MinistrySection
                        profile={profile}
                        onChange={updateField}
                      />
                    </TabPanel>
                  </TabPanels>
                </Column>
              </Grid>
            </Tabs>
          </Column>
        </Grid>
      </div>

      {/* ── Sticky save bar ─────────────────────────────────── */}
      <div className={styles.saveBar}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className={styles.saveBarInner}>
              <span
                className={`save-bar__status ${
                  isDirty && saveStatus === "idle"
                    ? "save-bar__status--dirty"
                    : saveStatus === "saved"
                      ? "save-bar__status--saved"
                      : saveStatus === "error"
                        ? "save-bar__status--error"
                        : ""
                }`}
              >
                {saveStatus === "saving" && (
                  <>
                    <Loading withOverlay={false} small /> Saving to Firebase…
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CheckmarkFilled size={16} /> Saved successfully
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <ErrorFilled size={16} /> Save failed — check above
                  </>
                )}
                {saveStatus === "idle" && isDirty && (
                  <>
                    <WarningAltFilled size={16} /> Unsaved changes
                  </>
                )}
              </span>

              <div className={styles.saveBarActions}>
                <Button
                  kind="ghost"
                  size="md"
                  renderIcon={Reset}
                  iconDescription="Reset"
                  onClick={resetProfile}
                  disabled={saveStatus === "saving"}
                >
                  Reset
                </Button>
                <Button
                  kind="primary"
                  size="md"
                  renderIcon={Save}
                  iconDescription="Save profile"
                  onClick={handleSave}
                  disabled={
                    saveStatus === "saving" ||
                    (!isDirty && saveStatus !== "error")
                  }
                >
                  {saveStatus === "saving" ? "Saving…" : "Save Profile"}
                </Button>
              </div>
            </div>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default ProfilePage;
