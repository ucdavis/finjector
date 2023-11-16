import { useQuery } from "@tanstack/react-query";
import { doFetch } from "../util/api";
import {TeamResponseModel, TeamsResponseModel} from "../types";

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
