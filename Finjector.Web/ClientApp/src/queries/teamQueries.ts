import {useQuery} from "@tanstack/react-query";
import {doFetch} from "../util/api";
import {TeamResponse} from "../types";

export const useGetMyTeams = () =>
    useQuery(["teams", "me"], async () => {
        return await doFetch<TeamResponse[]>(fetch(`/api/team`))
    });