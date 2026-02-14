import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, WeeklyMoment, DailyChallenge, WeeklyChallenge, GlobalStats, ChatMessage, Connection } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(['currentUserProfile'], profile);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetTopMoments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeeklyMoment[]>({
    queryKey: ['topMoments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopMoments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitWeeklyMoment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, category }: { content: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWeeklyMoment(content, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topMoments'] });
    },
  });
}

export function useIncrementImpact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (momentId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementImpact(momentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topMoments'] });
    },
  });
}

export function useGetDailyChallenges() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyChallenge[]>({
    queryKey: ['dailyChallenges'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyChallenges();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCompleteDailyChallenge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeDailyChallenge(challengeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyChallenges'] });
    },
  });
}

export function useGetWeeklyChallenges() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeeklyChallenge[]>({
    queryKey: ['weeklyChallenges'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeeklyChallenges();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCompleteWeeklyChallenge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeWeeklyChallenge(challengeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyChallenges'] });
    },
  });
}

export function useGetGlobalStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GlobalStats>({
    queryKey: ['globalStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getGlobalStats();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
  });
}

// Global Chat Hooks
export function useGetGlobalChatFeed() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['globalChatFeed'],
    queryFn: async () => {
      if (!actor) return [];
      const messages = await actor.getGlobalChatFeed();
      return messages.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePostGlobalMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, perspective }: { content: string; perspective: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postGlobalMessage(content, perspective);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalChatFeed'] });
    },
  });
}

// Direct Messaging Hooks
export function useGetConversation(partner: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['conversation', partner?.toString()],
    queryFn: async () => {
      if (!actor || !partner) return [];
      const messages = await actor.getConversation(partner);
      return messages.sort((a, b) => Number(a.timestamp - b.timestamp));
    },
    enabled: !!actor && !actorFetching && !!partner,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiver, content }: { receiver: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(receiver, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.receiver.toString()] });
    },
  });
}

// Connections/Members Hooks
export function useGetAvailableConnections() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Connection[]>({
    queryKey: ['availableConnections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableConnections();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllUserProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allUserProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}
