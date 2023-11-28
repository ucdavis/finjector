import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { doFetch, doFetchEmpty } from "../util/api";
import {
  NameAndDescriptionModel,
  Team,
  TeamResponseModel,
  TeamsResponseModel,
} from "../types";

const queryClient = new QueryClient();

export const useGetMyTeams = () =>
  useQuery(["teams", "me"], async () => {
    return await doFetch<TeamsResponseModel[]>(fetch(`/api/team`));
  });

export const useGetTeam = (id: string | undefined) =>
  useQuery(
    ["teams", id],
    async () => {
      return await doFetch<TeamResponseModel>(fetch(`/api/team/${id}`));
    },
    { enabled: id !== undefined }
  );

export const useCreateTeamMutation = () =>
  useMutation(
    async (team: NameAndDescriptionModel) => {
      return await doFetch<Team>(
        fetch(`/api/team/`, {
          method: "POST",
          body: JSON.stringify(team),
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    },
    {
      onSuccess: () => {
        // invalidate teams query so we refetch
        queryClient.invalidateQueries(["teams", "me"]);
      },
    }
  );

export const useDeleteTeamMutation = () =>
  useMutation(
    async (id: string) => {
      return await doFetchEmpty(
        fetch(`/api/team/${id}`, {
          method: "DELETE",
        })
      );
    },
    {
      onSuccess: () => {
        // invalidate teams query so we refetch
        queryClient.invalidateQueries(["teams", "me"]);
      },
    }
  );

export const useLeaveTeamMutation = () =>
  useMutation(
    async (id: string) => {
      return await doFetchEmpty(
        fetch(`/api/team/${id}/leave`, {
          method: "POST",
        })
      );
    },
    {
      onSuccess: () => {
        // invalidate teams query so we refetch
        queryClient.invalidateQueries(["teams", "me"]);
      },
    }
  );
