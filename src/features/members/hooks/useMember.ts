/**
 * useMembers.ts
 *
 * React Query hooks for the Members collection.
 *
 * Setup required in your app root (app/layout.tsx or _app.tsx):
 *
 *   import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 *   const queryClient = new QueryClient();
 *   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
 *
 * Install deps:
 *   npm install @tanstack/react-query axios
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { MemberService } from "@/features/members/services/member.services";
import type {
  Member,
  UseCreateMemberResult,
  UseDeleteMemberResult,
  UseMembersResult,
  UseUpdateMemberResult,
} from "@/features/members/types";
import { isFirebaseApiError } from "@/shared/services/firebase.client";
// Centralised so invalidation is always consistent.

export const memberKeys = {
  all: ["members"] as const,
  one: (key: string) => ["members", key] as const,
} as const;

export function useMembers(): UseMembersResult {
  const { data, isLoading, isError, error, refetch } = useQuery<
    Member[],
    unknown
  >({
    queryKey: memberKeys.all,
    queryFn: () => MemberService.getAll(),
    staleTime: 1000 * 60 * 2, // 2 minutes — Firebase is cheap to read but no need to hammer it
    retry: 2,
  });

  const errorMsg = isFirebaseApiError(error)
    ? error.message
    : error instanceof Error
      ? error.message
      : null;

  return {
    members: data ?? [],
    isLoading,
    isError,
    error: errorMsg,
    refetch,
  };
}

export function useCreateMember(): UseCreateMemberResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Member,
    unknown,
    Omit<Member, "_computed" | "_firebaseKey">
  >({
    mutationFn: (member) => MemberService.create(member),

    // Optimistic update: add member to cache immediately, replace on settle
    onMutate: async (newMember) => {
      await queryClient.cancelQueries({ queryKey: memberKeys.all });

      const previous = queryClient.getQueryData<Member[]>(memberKeys.all);

      queryClient.setQueryData<Member[]>(memberKeys.all, (old = []) => [
        ...old,
        { ...newMember, _firebaseKey: "__optimistic__" } as Member,
      ]);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Roll back on failure
      const ctx = context as { previous?: Member[] };
      if (ctx?.previous) {
        queryClient.setQueryData(memberKeys.all, ctx.previous);
      }
    },

    onSettled: () => {
      // Always re-fetch to get the real Firebase key
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });

  return {
    createMember: mutation.mutateAsync,
    isCreating: mutation.isPending,
    createError: isFirebaseApiError(mutation.error)
      ? mutation.error.message
      : mutation.error instanceof Error
        ? mutation.error.message
        : null,
  };
}

export function useUpdateMember(): UseUpdateMemberResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Member,
    unknown,
    { firebaseKey: string; member: Omit<Member, "_computed" | "_firebaseKey"> }
  >({
    mutationFn: ({ firebaseKey, member }) =>
      MemberService.update(firebaseKey, member),

    onSuccess: (updated) => {
      // Patch the specific member in the list cache
      queryClient.setQueryData<Member[]>(memberKeys.all, (old = []) =>
        old.map((m) => (m._firebaseKey === updated._firebaseKey ? updated : m)),
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });

  return {
    updateMember: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: isFirebaseApiError(mutation.error)
      ? mutation.error.message
      : mutation.error instanceof Error
        ? mutation.error.message
        : null,
  };
}

export function usePatchMember() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    unknown,
    {
      firebaseKey: string;
      partial: Partial<Omit<Member, "_computed" | "_firebaseKey">>;
    }
  >({
    mutationFn: ({ firebaseKey, partial }) =>
      MemberService.patch(firebaseKey, partial),

    // Optimistic patch in the list
    onMutate: async ({ firebaseKey, partial }) => {
      await queryClient.cancelQueries({ queryKey: memberKeys.all });
      const previous = queryClient.getQueryData<Member[]>(memberKeys.all);

      queryClient.setQueryData<Member[]>(memberKeys.all, (old = []) =>
        old.map((m) =>
          m._firebaseKey === firebaseKey ? { ...m, ...partial } : m,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      const ctx = context as { previous?: Member[] };
      if (ctx?.previous) {
        queryClient.setQueryData(memberKeys.all, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
}

export function useDeleteMember(): UseDeleteMemberResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, unknown, string>({
    mutationFn: (firebaseKey) => MemberService.remove(firebaseKey),

    // Optimistic removal
    onMutate: async (firebaseKey) => {
      await queryClient.cancelQueries({ queryKey: memberKeys.all });
      const previous = queryClient.getQueryData<Member[]>(memberKeys.all);

      queryClient.setQueryData<Member[]>(memberKeys.all, (old = []) =>
        old.filter((m) => m._firebaseKey !== firebaseKey),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      const ctx = context as { previous?: Member[] };
      if (ctx?.previous) {
        queryClient.setQueryData(memberKeys.all, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });

  return {
    deleteMember: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}
