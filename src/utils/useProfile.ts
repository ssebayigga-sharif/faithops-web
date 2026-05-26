import { useState, useCallback, useRef } from "react";
import type { ChurchProfile } from "../churchTypes/profile";
import { DEFAULT_PROFILE } from "../churchTypes/profile";
import {
  fetchProfile as apiFetchProfile,
  saveProfile as apiSaveProfile,
  generateUid,
} from "../services/profile.services";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface UseProfileReturn {
  profile: ChurchProfile;
  isDirty: boolean;
  saveStatus: SaveStatus;
  errorMessage: string;
  isLoading: boolean;
  updateField: <K extends keyof ChurchProfile>(
    field: K,
    value: ChurchProfile[K],
  ) => void;
  updateNestedField: (
    parent: "emergencyContact",
    field: string,
    value: string,
  ) => void;
  saveProfile: () => Promise<void>;
  loadProfile: (uid: string) => Promise<void>;
  resetProfile: () => void;
  updatePhoto: (dataUrl: string) => void;
}

export function useProfile(initial?: Partial<ChurchProfile>): UseProfileReturn {
  const [profile, setProfile] = useState<ChurchProfile>({
    ...DEFAULT_PROFILE,
    ...initial,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateField = useCallback(
    <K extends keyof ChurchProfile>(field: K, value: ChurchProfile[K]) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      setSaveStatus("idle");
    },
    [],
  );

  const updateNestedField = useCallback(
    (parent: "emergencyContact", field: string, value: string) => {
      setProfile((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [field]: value },
      }));
      setIsDirty(true);
      setSaveStatus("idle");
    },
    [],
  );

  const updatePhoto = useCallback((dataUrl: string) => {
    setProfile((prev) => ({ ...prev, profilePhotoUrl: dataUrl }));
    setIsDirty(true);
  }, []);

  const saveProfile = useCallback(async () => {
    if (!profile.email && !profile.firstName) {
      setErrorMessage("Please enter at least a name or email before saving.");
      setSaveStatus("error");
      return;
    }
    setSaveStatus("saving");
    setErrorMessage("");
    try {
      const uid =
        profile.uid || generateUid(profile.email || profile.firstName);
      const saved = await apiSaveProfile(uid, { ...profile, uid });
      setProfile(saved);
      setIsDirty(false);
      setSaveStatus("saved");
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setSaveStatus("error");
    }
  }, [profile]);

  const loadProfile = useCallback(async (uid: string) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await apiFetchProfile(uid);
      if (data) {
        setProfile(data);
        setIsDirty(false);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetProfile = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE });
    setIsDirty(false);
    setSaveStatus("idle");
    setErrorMessage("");
  }, []);

  return {
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
  };
}
