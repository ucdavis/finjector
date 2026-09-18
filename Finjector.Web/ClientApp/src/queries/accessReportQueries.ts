import { useQuery } from "@tanstack/react-query";
import { UserAccessReportRow } from "../models/reports/UserAccessReportRow";
import { doFetch } from "../util/api";

export const useUserAccessReport = (teamId?: string, folderId?: string) =>
  useQuery({
    queryKey: ["user-access-report", teamId, folderId],
    queryFn: async ({ signal }) => {
      const parameters = new URLSearchParams();
      if (teamId !== undefined) parameters.set("teamId", teamId);
      if (folderId !== undefined) parameters.set("folderId", folderId);
      const query = parameters.toString();

      return await doFetch<UserAccessReportRow[]>(
        fetch(`/api/user/permissions/report${query ? `?${query}` : ""}`, {
          signal,
          cache: "no-store",
        })
      );
    },
    // Access reviews should fetch current permissions whenever they are opened.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
