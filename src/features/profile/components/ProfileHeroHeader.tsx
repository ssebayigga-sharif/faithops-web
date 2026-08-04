import React from "react";
import { Button, Tag } from "@carbon/react";
import {
  Edit,
  Save,
  Close,
  CheckmarkFilled,
  Copy,
  Share,
  User,
  Calendar,
  Events,
  Location,
  Badge,
} from "@carbon/icons-react";
import { ProfileAvatar } from "./ProfileAvatar";
import type { ChurchProfile } from "../types";
import styles from "../profile.module.scss";

interface ProfileHeroHeaderProps {
  mode: "view" | "edit";
  profile: Partial<ChurchProfile>;
  formValues?: {
    firstName?: string;
    lastName?: string;
    profilePhotoUrl?: string;
    coverPhotoUrl?: string;
  };
  isSaving?: boolean;
  isDirty?: boolean;
  isOwner?: boolean;
  onStartEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onPhotoChange?: (dataUrl: string) => void;
  onCoverChange?: (dataUrl: string) => void;
  onSendMessage?: () => void;
}

export const ProfileHeroHeader: React.FC<ProfileHeroHeaderProps> = ({
  mode,
  profile,
  formValues,
  isSaving = false,
  isDirty = false,
  isOwner = true,
  onStartEdit,
  onCancel,
  onSave,
  onPhotoChange,
  onCoverChange,
  onSendMessage,
}) => {
  const [copied, setCopied] = React.useState(false);

  const displayFirstName =
    mode === "view" ? profile.firstName || "" : formValues?.firstName || "";
  const displayLastName =
    mode === "view" ? profile.lastName || "" : formValues?.lastName || "";
  const displayPhotoUrl =
    mode === "view"
      ? profile.profilePhotoUrl || ""
      : formValues?.profilePhotoUrl || "";
  const displayCoverUrl =
    mode === "view"
      ? profile.coverPhotoUrl || ""
      : formValues?.coverPhotoUrl || "";

  const fullName =
    [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ") || "Church Member";

  const displayName =
    mode === "view"
      ? fullName
      : `${displayFirstName} ${displayLastName}`.trim() || "Edit Profile";

  const memberSinceYear = profile.dateJoined
    ? new Date(profile.dateJoined).getFullYear()
    : new Date().getFullYear();

  const yearsAsMember = new Date().getFullYear() - memberSinceYear;
  const memberId =
    profile.membershipNumber ||
    profile.uid?.slice(0, 8).toUpperCase() ||
    "MB-2024";

  const handleCopyId = () => {
    navigator.clipboard.writeText(memberId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}${isOwner ? "/profile" : `/profile/${profile.uid || ""}`}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} • FaithOps Profile`,
          text: "View this member's profile on FaithOps.",
          url: profileUrl,
        });
        return;
      } catch {
        // ignore user cancel
      }
    }
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBaptized = profile.baptismStatus === "baptised";
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Banner image must be smaller than 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => onCoverChange?.(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.heroBanner}>
      {/* Cover background */}
      <div className={styles.heroCover}>
        {displayCoverUrl ? (
          <img
            src={displayCoverUrl}
            alt="Banner"
            className={styles.heroCover__image}
          />
        ) : (
          <>
            <div className={styles.heroCover__pattern} />
            <div className={styles.heroCover__overlay} />
          </>
        )}

        {mode === "edit" && isOwner && (
          <>
            <button
              type="button"
              className={styles.heroCoverUploadButton}
              onClick={() => coverInputRef.current?.click()}
            >
              Upload Banner
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className={styles.heroCoverFileInput}
              onChange={handleCoverUpload}
            />
          </>
        )}
      </div>

      {/* Main hero body */}
      <div className={styles.heroBody}>
        <div className={styles.heroAvatarContainer}>
          <ProfileAvatar
            readOnly={mode === "view" || !isOwner}
            photoUrl={displayPhotoUrl}
            firstName={displayFirstName}
            lastName={displayLastName}
            onPhotoChange={onPhotoChange || (() => {})}
          />
          <div className={styles.heroAvatarStatus} title="Active Member" />
        </div>

        <div className={styles.heroMeta}>
          <div className={styles.heroTitleRow}>
            <h1 className={styles.heroName}>
              {displayName}
              <CheckmarkFilled
                size={20}
                className={styles.heroVerifiedIcon}
                title="Verified Church Member"
              />
            </h1>
            <div className={styles.heroTags}>
              <Tag type="blue" size="sm" className={styles.heroRoleTag}>
                {profile.role ? profile.role.toUpperCase() : "MEMBER"}
              </Tag>
              {profile.department && (
                <Tag type="teal" size="sm">
                  {profile.department}
                </Tag>
              )}
            </div>
          </div>

          <div className={styles.heroSubRow}>
            <span className={styles.heroSubItem}>
              <Location size={14} /> Kabulengwa SDA Church
            </span>
            {profile.cellGroup && (
              <span className={styles.heroSubItem}>
                <Events size={14} /> {profile.cellGroup}
              </span>
            )}
            <button
              type="button"
              className={styles.heroIdChip}
              onClick={handleCopyId}
              title="Click to copy Member ID"
            >
              <Badge size={14} /> #{memberId}
              <Copy size={12} style={{ marginLeft: 4 }} />
              {copied && (
                <span className={styles.heroCopiedToast}>Copied!</span>
              )}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className={styles.heroStatsBar}>
            <div className={styles.heroStatCard}>
              <span className={styles.heroStatLabel}>Membership</span>
              <strong className={styles.heroStatValue}>
                <Calendar size={14} />{" "}
                {yearsAsMember > 0 ? `${yearsAsMember} yrs` : "New"}
              </strong>
            </div>

            <div className={styles.heroStatCard}>
              <span className={styles.heroStatLabel}>Baptism</span>
              <strong className={styles.heroStatValue}>
                <User size={14} /> {isBaptized ? "Baptized" : "Candidate"}
              </strong>
            </div>

            <div className={styles.heroStatCard}>
              <span className={styles.heroStatLabel}>Status</span>
              <strong
                className={`${styles.heroStatValue} ${styles.heroStatValueActive}`}
              >
                {profile.membershipStatus
                  ? profile.membershipStatus.toUpperCase()
                  : "ACTIVE"}
              </strong>
            </div>

            <div className={styles.heroStatCard}>
              <span className={styles.heroStatLabel}>Cell Group</span>
              <strong className={styles.heroStatValue}>
                {profile.cellGroup || "Central"}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className={styles.heroActions}>
          {isOwner ? (
            mode === "view" ? (
              <div className={styles.heroActionGroup}>
                <Button
                  kind="primary"
                  size="md"
                  renderIcon={Edit}
                  onClick={onStartEdit}
                >
                  Edit Profile
                </Button>
                <Button
                  kind="ghost"
                  size="md"
                  renderIcon={Share}
                  onClick={handleShareProfile}
                >
                  Share Profile
                </Button>
              </div>
            ) : (
              <div className={styles.heroEditActions}>
                <Button
                  kind="secondary"
                  size="md"
                  renderIcon={Close}
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  kind="primary"
                  size="md"
                  renderIcon={Save}
                  onClick={onSave}
                  disabled={isSaving || !isDirty}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            )
          ) : (
            onSendMessage && (
              <div className={styles.heroActionGroup}>
                <Button
                  kind="primary"
                  size="md"
                  renderIcon={User}
                  onClick={onSendMessage}
                >
                  Send Message
                </Button>
                <Button
                  kind="ghost"
                  size="md"
                  renderIcon={Share}
                  onClick={handleShareProfile}
                >
                  Share Profile
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeroHeader;
