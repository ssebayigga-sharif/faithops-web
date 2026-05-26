import React, { useRef, useCallback } from "react";
import { Edit } from "@carbon/icons-react";

interface Props {
  photoUrl: string;
  firstName: string;
  lastName: string;
  onPhotoChange: (dataUrl: string) => void;
}

export const ProfileAvatar: React.FC<Props> = ({
  photoUrl,
  firstName,
  lastName,
  onPhotoChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => onPhotoChange(ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onPhotoChange],
  );

  return (
    <div className="profile-avatar">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="profile-avatar__image"
        />
      ) : (
        <div
          className="profile-avatar__placeholder"
          aria-label={`${firstName} ${lastName} initials`}
        >
          {initials}
        </div>
      )}
      <button
        type="button"
        className="profile-avatar__upload-btn"
        onClick={() => inputRef.current?.click()}
        aria-label="Change profile photo"
        title="Change photo"
      >
        <Edit size={14} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="profile-avatar__file-input"
        onChange={handleFile}
      />
    </div>
  );
};
