/**
 * search.service.ts
 *
 * Searches across profiles and events in Firebase Realtime Database.
 * Runs fuzzy filtering client-side for profiles and events.
 */
import { ref, get, child } from "firebase/database";
import { getFirebaseDatabase } from "../../../shared/services/firebase";
import type { ChurchProfile } from "../../profile/types";
import type { ChurchEvent } from "../../events/types";

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

export interface EventSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  venue: string;
  start: string;
  speaker: string;
}

export interface CombinedSearchResult {
  members: SearchResult[];
  events: EventSearchResult[];
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
    fields.some((field) => field && normalise(field).includes(token)),
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

    results.sort((a, b) => a.firstName.localeCompare(b.firstName));
    return results;
  },

  /**
   * Search all events by title, description, category, department, speaker, or venue.
   */
  async searchEvents(query: string): Promise<EventSearchResult[]> {
    const db = getFirebaseDatabase();
    const snapshot = await get(child(ref(db), "events"));

    if (!snapshot.exists()) return [];

    const data = snapshot.val() as Record<string, ChurchEvent>;
    const results: EventSearchResult[] = [];

    for (const [id, event] of Object.entries(data)) {
      if (
        matchesQuery(query, [
          event.title,
          event.description,
          event.category,
          event.department,
          event.speaker,
          event.venue,
        ])
      ) {
        results.push({
          id: event.id || id,
          title: event.title,
          description: event.description ?? "",
          category: event.category,
          department: event.department,
          venue: event.venue ?? "",
          start: event.start,
          speaker: event.speaker ?? "",
        });
      }
    }

    // Sort by date (newest/closest start first)
    results.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return results;
  },

  /**
   * Combined search for both profiles and events.
   */
  async searchAll(query: string): Promise<CombinedSearchResult> {
    if (!query.trim()) {
      return { members: [], events: [] };
    }
    const [members, events] = await Promise.all([
      this.searchProfiles(query),
      this.searchEvents(query),
    ]);
    return { members, events };
  },
};
