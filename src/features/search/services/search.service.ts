/**
 * search.service.ts
 *
 * Searches across profiles in Firebase Realtime Database.
 * Since Firebase RTDB doesn't support full-text search natively,
 * we fetch all profiles and filter client-side (acceptable for
 * church-size datasets of hundreds to low thousands of records).
 */
import { ref, get, child } from "firebase/database";
import { getFirebaseDatabase } from "@/shared/services/firebase";
import type { ChurchProfile } from "@/features/profile/types";

export interface SearchResult {
  uid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  profilePhotoUrl: string;
  department: string;
  cellGroup: string;
}

/**
 * Normalise a string for fuzzy comparison: lower-case, remove extra spaces.
 */
function normalise(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Check whether `query` tokens appear in any of `fields`.
 */
function matchesQuery(query: string, fields: string[]): boolean {
  const q = normalise(query);
  if (!q) return true; // empty query matches everything
  const tokens = q.split(/\s+/);
  return tokens.every((token) =>
    fields.some((field) => normalise(field).includes(token)),
  );
}

export const SearchService = {
  /**
   * Search all profiles by name, email, phone, department, or cell group.
   */
  async searchProfiles(query: string): Promise<SearchResult[]> {
    const db = getFirebaseDatabase();
    const snapshot = await get(child(ref(db), "profiles"));

    if (!snapshot.exists()) return [];

    const data = snapshot.val() as Record<string, ChurchProfile>;

    const results: SearchResult[] = [];

    for (const [uid, profile] of Object.entries(data)) {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();

      if (
        matchesQuery(query, [
          profile.firstName,
          profile.lastName,
          fullName,
          profile.email,
          profile.phone,
          profile.department,
          profile.cellGroup,
        ])
      ) {
        results.push({
          uid,
          firstName: profile.firstName,
          lastName: profile.lastName,
          fullName,
          email: profile.email,
          phone: profile.phone,
          role: profile.role ?? "member",
          profilePhotoUrl: profile.profilePhotoUrl ?? "",
          department: profile.department ?? "",
          cellGroup: profile.cellGroup ?? "",
        });
      }
    }

    // Sort by firstName alphabetically
    results.sort((a, b) => a.firstName.localeCompare(b.firstName));

    return results;
  },
};
