/**
 * profile.services.ts
 *
 * Firebase Realtime Database service for user profiles.
 * Uses the shared firebaseClient (Axios) — same pattern as MemberService.
 *
 * Firebase RTDB path: /profiles/{uid}.json
 */

import type { AxiosResponse } from "axios";
import { firebaseClient } from "@/shared/services/firebase.client";
import type { ChurchProfile } from "@/features/profile/types";

const PROFILES_PATH = "/profiles";

export const ProfileService = {
  /**
   * GET /profiles/{uid}.json
   * Fetch a single profile by UID.
   */
  async getOne(uid: string): Promise<ChurchProfile | null> {
    const res: AxiosResponse<ChurchProfile | null> =
      await firebaseClient.get(`${PROFILES_PATH}/${uid}.json`);
    return res.data ?? null;
  },

  /**
   * PUT /profiles/{uid}.json
   * Create or fully overwrite a profile.
   */
  async save(uid: string, profile: ChurchProfile): Promise<ChurchProfile> {
    const now = new Date().toISOString();
    const payload: ChurchProfile = {
      ...profile,
      uid,
      updatedAt: now,
      createdAt: profile.createdAt || now,
    };

    const res: AxiosResponse<ChurchProfile> = await firebaseClient.put(
      `${PROFILES_PATH}/${uid}.json`,
      payload,
    );

    return res.data;
  },

  /**
   * PATCH /profiles/{uid}.json
   * Shallow-merge partial updates into an existing profile.
   */
  async patch(
    uid: string,
    partial: Partial<ChurchProfile>,
  ): Promise<Partial<ChurchProfile>> {
    const payload = { ...partial, updatedAt: new Date().toISOString() };
    const res: AxiosResponse<Partial<ChurchProfile>> =
      await firebaseClient.patch(`${PROFILES_PATH}/${uid}.json`, payload);
    return res.data;
  },

  /**
   * DELETE /profiles/{uid}.json
   */
  async remove(uid: string): Promise<void> {
    await firebaseClient.delete(`${PROFILES_PATH}/${uid}.json`);
  },
} as const;

/**
 * Derives a stable key from an email or name string.
 * Replace with Firebase Auth UID once authentication is added.
 */
export function generateUid(seed: string): string {
  return seed
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .slice(0, 28);
}
