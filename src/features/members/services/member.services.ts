import { AxiosResponse } from "axios";
import { firebaseClient } from "@/shared/services/firebase.client";
import { computeMember } from "@/features/members/utils/memberUtils";
import type { Member } from "@/features/members/types";

const MEMBERS_PATH = "/members";

type FirebaseMap = Record<string, Omit<Member, "_computed">>;

function mapToMembers(data: FirebaseMap | null): Member[] {
  if (!data) return [];

  return Object.entries(data).map(([_pushKey, raw]) =>
    computeMember({ ...raw, _firebaseKey: _pushKey } as Member),
  );
}

export const MemberService = {
  //GET /members.json
  // Returns all members, sorted by joinedAt desc.

  async getAll(): Promise<Member[]> {
    const res: AxiosResponse<FirebaseMap | null> = await firebaseClient.get(
      `${MEMBERS_PATH}.json`,
      {
        params: {
          // Firebase query params: order by joinedAt field
          orderBy: '"joinedAt"',
        },
      },
    );

    return mapToMembers(res.data);
  },

  // GET /members/<pushKey>.json
  //Fetch a single member by their Firebase push key.
  // Use member._firebaseKey after getAll() to obtain the key.

  async getOne(firebaseKey: string): Promise<Member> {
    const res: AxiosResponse<Omit<Member, "_computed"> | null> =
      await firebaseClient.get(`${MEMBERS_PATH}/${firebaseKey}.json`);

    if (!res.data) {
      throw new Error(`Member with key "${firebaseKey}" not found.`);
    }

    return computeMember({ ...res.data, _firebaseKey: firebaseKey } as Member);
  },

  //  POST /members.json
  //Create a new member. Firebase generates a push key automatically.

  async create(
    member: Omit<Member, "_computed" | "_firebaseKey">,
  ): Promise<Member> {
    // Never persist computed fields
    const { _computed, ...payload } = member as Member;

    const res: AxiosResponse<{ name: string }> = await firebaseClient.post(
      `${MEMBERS_PATH}.json`,
      payload,
    );

    return computeMember({
      ...payload,
      _firebaseKey: res.data.name,
    } as Member);
  },

  async update(
    firebaseKey: string,
    member: Omit<Member, "_computed" | "_firebaseKey">,
  ): Promise<Member> {
    const { _computed, ...payload } = member as Member;

    await firebaseClient.put(`${MEMBERS_PATH}/${firebaseKey}.json`, payload);

    return computeMember({ ...payload, _firebaseKey: firebaseKey } as Member);
  },

  async patch(
    firebaseKey: string,
    partial: Partial<Omit<Member, "_computed" | "_firebaseKey">>,
  ): Promise<void> {
    await firebaseClient.patch(`${MEMBERS_PATH}/${firebaseKey}.json`, partial);
  },

  async remove(firebaseKey: string): Promise<void> {
    await firebaseClient.delete(`${MEMBERS_PATH}/${firebaseKey}.json`);
  },

  async bulkCreate(
    members: Omit<Member, "_computed" | "_firebaseKey">[],
  ): Promise<void> {
    // Generate pseudo push IDs client-side (Firebase accepts any unique key)
    const payload: Record<
      string,
      Omit<Member, "_computed" | "_firebaseKey">
    > = {};

    members.forEach((m) => {
      const pushKey = `-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      payload[pushKey] = m;
    });

    await firebaseClient.patch(`${MEMBERS_PATH}.json`, payload);
  },
} as const;
/**
 * member.service.ts
 *   /members.json → {
 *     "-NxAbc123": { id: "KSC-0001", firstName: "Agnes", ... },
 *     "-NxDef456": { id: "KSC-0002", firstName: "Peter", ... },
 *   }
 */
