import { useQuery } from "@tanstack/react-query";
import { doFetch } from "../util/api";
import { FolderResponseModel } from "../types";

export const useGetFolder = (id: string | undefined) =>
  useQuery(
    ["folders", id],
    async () => {
      return await doFetch<FolderResponseModel>(fetch(`/api/folder/${id}`));
    },
    { enabled: id !== undefined }
  );
