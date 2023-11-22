import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doFetch } from "../util/api";
import { CollectionResourceType, PermissionsResponseModel } from "../types";

// attempt to fetch user info -- if we get a 401, redirect to login
export const useUserInfoQuery = () =>
  useQuery(["users", "info"], async () => {
    const res = await fetch("/api/user/info");

    if (res.ok) {
      return await res.json();
    }

    if (res.status === 401) {
      window.location.href = `/account/login?returnUrl=${window.location.href}`;
    }

    throw new Error(`${res.status} ${res.statusText}`);
  });

// fetch permission info for a given team or folder
export const usePermissionsQuery = (id: string, type: CollectionResourceType) =>
  useQuery(["users", "permissions", type, id], async () => {
    return await doFetch<PermissionsResponseModel[]>(
      fetch(`/api/user/permissions/${type}/${id}`)
    );
  });

// new mutation to add a user to a resource
export const useAddUserMutation = (
  id: string,
  type: CollectionResourceType
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: { email: string; role: string }) => {
      const res = await fetch(`/api/user/permissions/${type}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    },
    {
      onSuccess: () => {
        // invalidate the permissions query so we refetch
        queryClient.invalidateQueries(["users", "permissions", type, id]);
      },
    }
  );
};
