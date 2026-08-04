import React, { useEffect, useState } from "react";
import {
  Grid,
  Column,
  Button,
  InlineNotification,
  Loading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tile,
} from "@carbon/react";
import { Save, Edit, Close } from "@carbon/icons-react";

import { ProfileHeroHeader } from "../components/ProfileHeroHeader";
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
    exists,
    isLoading,
    isSaving,
    error: loadError,
    saveProfile,
    saveError,
    activeUid,
  } = useProfile();

  // Mode: "view" (default if profile exists) or "edit"
  const [mode, setMode] = useState<"view" | "edit">("view");

  // If no profile exists yet in the database, default to edit mode
  useEffect(() => {
    if (!isLoading) {
      setMode(exists ? "view" : "edit");
    }
  }, [isLoading, exists]);

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
  const formCoverPhotoUrl = watch("coverPhotoUrl") || "";
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
      <ProfileHeroHeader
        mode={mode}
        profile={profile}
        formValues={{
          firstName: formFirstName,
          lastName: formLastName,
          profilePhotoUrl: formPhotoUrl,
          coverPhotoUrl: formCoverPhotoUrl,
        }}
        isSaving={isSaving}
        isDirty={isDirty}
        isOwner={true}
        onStartEdit={handleStartEdit}
        onCancel={handleCancel}
        onSave={handleSubmit(onSubmit)}
        onPhotoChange={handlePhotoChange}
        onCoverChange={(dataUrl) =>
          setValue("coverPhotoUrl", dataUrl, { shouldDirty: true })
        }
      />

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

      <Grid className={styles.profileGrid}>
        <Column lg={16} md={8} sm={4}>
          <div className={styles.profileSections}>
            <Tabs>
              <TabList aria-label="Profile sections" contained>
                <Tab>Overview</Tab>
                <Tab>Church & Ministry</Tab>
                <Tab>Family & Household</Tab>
                <Tab>Activity & Milestones</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
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
                  </form>
                </TabPanel>
                <TabPanel>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <MembershipSection
                      readOnly={mode === "view"}
                      profile={mode === "view" ? profile : {}}
                      register={register}
                      errors={errors}
                      control={control}
                    />
                  </form>
                </TabPanel>
                <TabPanel>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FamilySection
                      readOnly={mode === "view"}
                      profile={mode === "view" ? profile : {}}
                      register={register}
                      errors={errors}
                      control={control}
                      maritalStatusValue={maritalStatusValue}
                    />
                  </form>
                </TabPanel>
                <TabPanel>
                  <Tile className="profile-section">
                    <h2 className="profile-section__heading">
                      Activity & Milestones
                    </h2>
                    <div className="profile-view-grid">
                      <div className="profile-view-item">
                        <span className="profile-view-label">Last Active</span>
                        <span className="profile-view-value">
                          {profile.updatedAt
                            ? new Date(profile.updatedAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Attendance Score
                        </span>
                        <span className="profile-view-value">
                          {profile.attendanceScore || "N/A"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Recent Milestone
                        </span>
                        <span className="profile-view-value">
                          {profile.baptismStatus === "baptised"
                            ? "Baptised"
                            : "New member"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Member Since</span>
                        <span className="profile-view-value">
                          {memberSince || "—"}
                        </span>
                      </div>
                    </div>
                  </Tile>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </Column>
      </Grid>
    </div>
  );
};

export default ProfilePage;
