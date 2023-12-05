import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { doFetch } from "../util/api";
import { Folder, FolderResponseModel, NameAndDescriptionModel } from "../types";

const queryClient = new QueryClient();

export const useGetFolder = (id: string | undefined) =>
  useQuery(
    ["folders", id],
    async () => {
      return await doFetch<FolderResponseModel>(fetch(`/api/folder/${id}`));
    },
    { enabled: id !== undefined, refetchOnWindowFocus: false }
  );

export const useCreateFolderMutation = (teamId: string) =>
  useMutation(
    async (folder: NameAndDescriptionModel) => {
      return await doFetch<Folder>(
        fetch(`/api/folder?teamId=${teamId}`, {
          method: "POST",
          body: JSON.stringify(folder),
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    },
    {
      onSuccess: () => {
        // invalidate team query for this team so the new foldr shows up
        queryClient.invalidateQueries(["teams", teamId]);
      },
    }
  );

export const useEditFolderMutation = (teamId: string, folderId: string) =>
  useMutation(
    async (folder: NameAndDescriptionModel) => {
      return await doFetch<Folder>(
        fetch(`/api/folder/${folderId}`, {
          method: "PUT",
          body: JSON.stringify(folder),
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    },
    {
      onSuccess: () => {
        // invalidate team query for this team so the new foldr shows up
        queryClient.invalidateQueries(["teams", teamId]);
        queryClient.invalidateQueries(["folders", folderId]);
      },
    }
  );
