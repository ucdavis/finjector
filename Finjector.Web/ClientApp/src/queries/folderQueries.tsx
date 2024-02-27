import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { doFetch, doFetchEmpty } from "../util/api";
import { Folder, FolderResponseModel, NameAndDescriptionModel } from "../types";

const queryClient = new QueryClient();

export const useGetFolder = (id: string | undefined) =>
  useQuery({
    queryKey: ["folders", id],
    queryFn: async () => {
      return await doFetch<FolderResponseModel>(fetch(`/api/folder/${id}`));
    },
    enabled: id !== undefined,
  });

export const useGetFolderSearchList = () =>
  useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      return await doFetch<Folder[]>(fetch(`/api/folder/folderSearchList`));
    },
  });

export const useCreateFolderMutation = (teamId: string) =>
  useMutation({
    mutationFn: async (folder: NameAndDescriptionModel) => {
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
    onSuccess: () => {
      // invalidate team query for this team so the new foldr shows up
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
    },
  });

export const useEditFolderMutation = (teamId: string, folderId: string) =>
  useMutation({
    mutationFn: async (folder: NameAndDescriptionModel) => {
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
    onSuccess: () => {
      // invalidate team query for this team so the new foldr shows up
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["folders", folderId] });
    },
  });

export const useDeleteFolderMutation = () =>
  useMutation({
    mutationFn: async (id: string) => {
      return await doFetchEmpty(
        fetch(`/api/folder/${id}`, {
          method: "DELETE",
        })
      );
    },
    onSuccess: () => {
      // invalidate teams query so we refetch
      queryClient.invalidateQueries({ queryKey: ["teams", "me"] });
      queryClient.invalidateQueries({ queryKey: ["folders", "me"] });
    },
  });

export const useLeaveFolderMutation = (teamId: string) =>
  useMutation({
    mutationFn: async (folderId: string) => {
      return await doFetchEmpty(
        fetch(`/api/folder/${folderId}/leave`, {
          method: "POST",
        })
      );
    },
    onSuccess: () => {
      // invalidate teams query so we refetch
      queryClient.invalidateQueries({ queryKey: ["teams", "me"] });
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["folders", "me"] });
    },
  });
