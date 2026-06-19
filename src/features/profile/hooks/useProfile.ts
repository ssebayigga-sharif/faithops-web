import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProfileService,
  generateUid,
} from "@/features/profile/services/profile.services";
import type { ChurchProfile } from "@/features/profile/types";
import { DEFAULT_PROFILE } from "@/features/profile/data/profile";
import { useCallback, useMemo } from "react";

export const profileKeys = {
  one: (uid: string) => ["profile", uid] as const,
};

// Key to store profile UID in localStorage
const LOCAL_STORAGE_KEY = "faithops_profile_uid";

/**
 * Helper to get the saved profile UID from local storage
 */
export function getSavedProfileUid(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

/**
 * Helper to set/save the profile UID in local storage
 */
export function setSavedProfileUid(uid: string): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, uid);
}

export function useProfile(uidInput?: string) {
  const queryClient = useQueryClient();

  // Determine actual UID: input prop -> localStorage -> fallback to empty/null
  const activeUid = uidInput || getSavedProfileUid() || "";

  // Query to fetch profile from Firebase
  const { data, isLoading, isError, error } = useQuery<
    ChurchProfile | null,
    Error
  >({
    queryKey: profileKeys.one(activeUid),
    queryFn: () => {
      if (!activeUid) return null;
      return ProfileService.getOne(activeUid);
    },
    enabled: !!activeUid,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });

  // Mutation to save/update the profile
  const saveMutation = useMutation<ChurchProfile, Error, ChurchProfile>({
    mutationFn: async (updatedProfile) => {
      const emailOrName = updatedProfile.email || updatedProfile.firstName;
      if (!emailOrName) {
        throw new Error("First name or email is required to save a profile.");
      }

      // Generate a stable UID if we don't have one
      const targetUid =
        updatedProfile.uid || activeUid || generateUid(emailOrName);

      const saved = await ProfileService.save(targetUid, {
        ...updatedProfile,
        uid: targetUid,
      });

      // Persist the UID in localStorage so the user can revisit it next time
      setSavedProfileUid(targetUid);

      return saved;
    },
    onSuccess: (savedData) => {
      if (savedData.uid) {
        queryClient.setQueryData(profileKeys.one(savedData.uid), savedData);
        queryClient.invalidateQueries({
          queryKey: profileKeys.one(savedData.uid),
        });
      }
    },
  });

  const clearProfileCache = useCallback(
    (uid: string) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.one(uid) });
    },
    [queryClient],
  );

  const profile = useMemo(
    () => data || { ...DEFAULT_PROFILE, uid: activeUid },
    [data, activeUid],
  );

  return {
    profile,
    isLoading: isLoading && !!activeUid,
    isError,
    error: error?.message || null,
    saveProfile: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error?.message || null,
    activeUid,
    clearProfileCache,
  };
}
