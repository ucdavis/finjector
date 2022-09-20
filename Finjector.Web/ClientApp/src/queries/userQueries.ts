import { useQuery } from "@tanstack/react-query";
import { doFetch } from "../util/api";

export const useUserInfoQuery = () =>
  useQuery(["users", "info"], () => doFetch<any>(fetch("/api/user/info")));
