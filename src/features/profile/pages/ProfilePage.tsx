import React, { useEffect, useState } from "react";
import {
  Grid,
  Column,
  Button,
  InlineNotification,
  Loading,
} from "@carbon/react";
import {
  Save,
  Edit,
  Close,
} from "@carbon/icons-react";

import { ProfileAvatar } from "../components/ProfileAvatar";
import { PersonalInfoSection } from "../components/PersonalInfoSection";
import { ContactInfoSection } from "../components/ContactInfoSection";
import { FamilySection } from "../components/FamilySection";
import { MembershipSection } from "../components/Membership";
import { useProfile } from "../hooks/useProfile";
import { useProfileForm } from "../hooks/useProfileForm";
import type { ProfileFormValues } from "../types";

import styles from "../profile.module.scss";

export const ProfilePage: React.FC = () => {
  const {
    profile,
    isLoading,
    isSaving,
    error: loadError,
    saveProfile,
    saveError,
    activeUid,
  } = useProfile();

  // Mode: "view" (default if profile exists) or "edit"
  const [mode, setMode] = useState<"view" | "edit">("view");

  // If no profile exists yet (no activeUid), default to edit mode
  useEffect(() => {
    if (!isLoading && !activeUid) {
      setMode("edit");
    } else if (!isLoading && activeUid) {
      setMode("view");
    }
  }, [isLoading, activeUid]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useProfileForm(profile);

  // Sync profile data to form once loaded
  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const maritalStatusValue = watch("maritalStatus");
  const formPhotoUrl = watch("profilePhotoUrl") || "";
  const formFirstName = watch("firstName") || "";
  const formLastName = watch("lastName") || "";

  // Switch to edit mode and populate form with current profile data
  const handleStartEdit = () => {
    reset(profile);
    setMode("edit");
  };

  // Cancel edit mode and reset form to original profile data
  const handleCancel = () => {
    reset(profile);
    if (!activeUid) {
      // If new profile and cancelled, stay in edit but reset
    } else {
      setMode("view");
    }
  };

  const handlePhotoChange = (dataUrl: string) => {
    setValue("profilePhotoUrl", dataUrl, { shouldDirty: true });
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const fullProfile = {
        ...profile,
        ...data,
      };
      await saveProfile(fullProfile);
      setMode("view");
    } catch (err) {
      // Error handled by useProfile hook
    }
  };

  // ── Loading state ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.profilePageLoading}>
        <Loading description="Loading profile..." withOverlay />
      </div>
    );
  }

  const fullName =
    [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ") || "New Member";

  const memberSince = profile.dateJoined
    ? new Date(profile.dateJoined).getFullYear()
    : null;

  return (
    <div className={styles.profilePage}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className={styles.profileHeader}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className={styles.profileHeader__inner}>
              <ProfileAvatar
                readOnly={mode === "view"}
                photoUrl={mode === "view" ? (profile.profilePhotoUrl || "") : formPhotoUrl}
                firstName={mode === "view" ? (profile.firstName || "") : formFirstName}
                lastName={mode === "view" ? (profile.lastName || "") : formLastName}
                onPhotoChange={handlePhotoChange}
              />

              <div className={styles.profileHeader__meta}>
                <h1 className={styles.profileHeader__name}>
                  {mode === "view" ? fullName : `${formFirstName} ${formLastName}`.trim() || "Create Profile"}
                </h1>
                <p className={styles.profileHeader__subtitle}>
                  {profile.department
                    ? `${profile.department} Department`
                    : "Church Member"}
                  {profile.cellGroup ? ` · ${profile.cellGroup}` : ""}
                  {memberSince ? ` · Member since ${memberSince}` : ""}
                </p>
              </div>

              <div className={styles.profileHeader__actions}>
                {mode === "view" ? (
                  <Button
                    kind="primary"
                    size="md"
                    renderIcon={Edit}
                    onClick={handleStartEdit}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className={styles.profileHeader__editActions}>
                    <Button
                      kind="secondary"
                      size="md"
                      renderIcon={Close}
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      kind="primary"
                      size="md"
                      renderIcon={Save}
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSaving || !isDirty}
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Column>
        </Grid>
      </div>

      {/* ── Notifications ────────────────────────────────────── */}
      {(loadError || saveError) && (
        <Grid style={{ marginBottom: "1rem" }}>
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="error"
              lowContrast
              title="Error:"
              subtitle={saveError || loadError || undefined}
            />
          </Column>
        </Grid>
      )}

      {/* ── Main Layout ──────────────────────────────────────── */}
      <Grid className={styles.profileGrid}>
        <Column lg={16} md={8} sm={4}>
          <div className={styles.profileSections}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <PersonalInfoSection
                readOnly={mode === "view"}
                profile={mode === "view" ? profile : {}}
                register={register}
                errors={errors}
                control={control}
              />

              <ContactInfoSection
                readOnly={mode === "view"}
                profile={mode === "view" ? profile : {}}
                register={register}
                errors={errors}
              />

              <FamilySection
                readOnly={mode === "view"}
                profile={mode === "view" ? profile : {}}
                register={register}
                errors={errors}
                control={control}
                maritalStatusValue={maritalStatusValue}
              />

              <MembershipSection
                readOnly={mode === "view"}
                profile={mode === "view" ? profile : {}}
                register={register}
                errors={errors}
                control={control}
              />
            </form>
          </div>
        </Column>
      </Grid>
    </div>
  );
};

export default ProfilePage;
