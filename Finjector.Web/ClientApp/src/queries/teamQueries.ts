import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';

import {
  NameAndDescriptionModel,
  Team,
  TeamResponseModel,
  TeamsResponseModel,
} from '../types';
import { doFetch, doFetchEmpty } from '../util/api';

const queryClient = new QueryClient();

export const useGetMyTeams = () =>
  useQuery({
    queryKey: ['teams', 'me'],
    queryFn: async () => {
      return await doFetch<TeamsResponseModel[]>(fetch('/api/team'));
    },
  });

export const useGetTeam = (id: string | undefined) =>
  useQuery({
    queryKey: ['teams', id],
    queryFn: async () => {
      return await doFetch<TeamResponseModel>(fetch(`/api/team/${id}`));
    },
    enabled: id !== undefined,
  });

export const useCreateTeamMutation = () =>
  useMutation({
    mutationFn: async (team: NameAndDescriptionModel) => {
      return await doFetch<Team>(
        fetch('/api/team/', {
          method: 'POST',
          body: JSON.stringify(team),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    },
    onSuccess: () => {
      // invalidate teams query so we refetch
      queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
    },
  });

export const useUpdateTeamMutation = (id: string) =>
  useMutation({
    mutationFn: async (team: NameAndDescriptionModel) => {
      return await doFetch<Team>(
        fetch(`/api/team/${id}`, {
          method: 'PUT',
          body: JSON.stringify(team),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    },
    onSuccess: () => {
      // invalidate teams query so we refetch
      queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['teams', id] });
    },
  });

export const useDeleteTeamMutation = () =>
  useMutation({
    mutationFn: async (id: string) => {
      return await doFetchEmpty(
        fetch(`/api/team/${id}`, {
          method: 'DELETE',
        })
      );
    },
    onSuccess: () => {
      // invalidate teams query so we refetch
      queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
    },
  });

export const useLeaveTeamMutation = () =>
  useMutation({
    mutationFn: async (id: string) => {
      return await doFetchEmpty(
        fetch(`/api/team/${id}/leave`, {
          method: 'POST',
        })
      );
    },
    onSuccess: () => {
      // invalidate teams query so we refetch
      queryClient.invalidateQueries({ queryKey: ['teams', 'me'] });
    },
  });
