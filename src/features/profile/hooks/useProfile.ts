import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/features/profile/services/profile.services";
import type { ChurchProfile } from "@/features/profile/types";
import { DEFAULT_PROFILE } from "@/features/profile/data/profile";
import { useCallback, useMemo } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

export const profileKeys = {
  one: (uid: string) => ["profile", uid] as const,
};

export function useProfile(uidInput?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Determine actual UID: input prop -> Firebase Auth UID -> fallback to empty
  const activeUid = uidInput || user?.uid || "";

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

      // Use Firebase Auth UID if available, otherwise fallback
      const targetUid = updatedProfile.uid || activeUid || user?.uid || "";

      if (!targetUid) {
        throw new Error("User ID is required to save a profile.");
      }

      const saved = await ProfileService.save(targetUid, {
        ...updatedProfile,
        uid: targetUid,
      });

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
