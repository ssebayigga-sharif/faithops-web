import type { ChurchProfile } from "../churchTypes/profile";

const BASE_URL = "https://my-church-9abc5-default-rtdb.firebaseio.com";

export async function fetchProfile(uid: string): Promise<ChurchProfile | null> {
  const res = await fetch(`${BASE_URL}/profiles/${uid}.json`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
  return res.json() as Promise<ChurchProfile | null>;
}

export async function saveProfile(
  uid: string,
  profile: ChurchProfile,
): Promise<ChurchProfile> {
  const now = new Date().toISOString();
  const payload: ChurchProfile = {
    ...profile,
    uid,
    updatedAt: now,
    createdAt: profile.createdAt || now,
  };

  const res = await fetch(`${BASE_URL}/profiles/${uid}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Save failed: ${res.statusText}`);
  return res.json() as Promise<ChurchProfile>;
}

export async function patchProfile(
  uid: string,
  partial: Partial<ChurchProfile>,
): Promise<Partial<ChurchProfile>> {
  const payload = { ...partial, updatedAt: new Date().toISOString() };
  const res = await fetch(`${BASE_URL}/profiles/${uid}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Patch failed: ${res.statusText}`);
  return res.json();
}

export async function deleteProfile(uid: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/profiles/${uid}.json`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
}

/** Derives a stable key from email — replace with Firebase Auth UID in prod */
export function generateUid(email: string): string {
  return email
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .slice(0, 28);
}
