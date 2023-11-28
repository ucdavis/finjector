import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { doFetch } from "../util/api";
import { Team, TeamResponseModel, TeamsResponseModel } from "../types";

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
    async (team: Team) => {
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
