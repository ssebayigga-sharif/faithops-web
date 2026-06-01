import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { ChurchEvent, UseCreateEventResult, UseEventsResult } from "@/features/events/types";
import { EventService } from "@/features/events/services/event.services";
import { isFirebaseApiError } from "@/shared/services/firebase.client";

export const eventKeys = {
  all: ["events"] as const,
  one: (key: string) => ["events", key] as const,
} as const;

export function useEvents(): UseEventsResult {
  const { data, isLoading, isError, error, refetch } = useQuery<
    ChurchEvent[],
    unknown
  >({
    queryKey: eventKeys.all,
    queryFn: () => EventService.getAll(),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });

  const errorMsg = isFirebaseApiError(error)
    ? error.message
    : error instanceof Error
      ? error.message
      : null;

  return {
    events: data ?? [],
    isLoading,
    isError,
    error: errorMsg,
    refetch,
  };
}

export function useCreateEvent(): UseCreateEventResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ChurchEvent,
    unknown,
    Omit<ChurchEvent, "_firebaseKey">
  >({
    mutationFn: (event) => EventService.create(event),

    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.all });
      const previous = queryClient.getQueryData<ChurchEvent[]>(eventKeys.all);

      queryClient.setQueryData<ChurchEvent[]>(eventKeys.all, (old = []) =>
        [...old, { ...newEvent, _firebaseKey: "__optimistic__" }].sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      const ctx = context as { previous?: ChurchEvent[] };
      if (ctx?.previous) {
        queryClient.setQueryData(eventKeys.all, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });

  return {
    createEvent: mutation.mutateAsync,
    isCreating: mutation.isPending,
    createError: isFirebaseApiError(mutation.error)
      ? mutation.error.message
      : mutation.error instanceof Error
        ? mutation.error.message
        : null,
  };
}

export function usePatchEvent() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    unknown,
    {
      firebaseKey: string;
      partial: Partial<Omit<ChurchEvent, "_firebaseKey">>;
    }
  >({
    mutationFn: ({ firebaseKey, partial }) =>
      EventService.patch(firebaseKey, partial),

    onMutate: async ({ firebaseKey, partial }) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.all });
      const previous = queryClient.getQueryData<ChurchEvent[]>(eventKeys.all);

      queryClient.setQueryData<ChurchEvent[]>(eventKeys.all, (old = []) =>
        old.map((event) =>
          event._firebaseKey === firebaseKey ? { ...event, ...partial } : event,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      const ctx = context as { previous?: ChurchEvent[] };
      if (ctx?.previous) {
        queryClient.setQueryData(eventKeys.all, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
