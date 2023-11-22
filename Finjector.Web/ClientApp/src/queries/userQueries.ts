import { useQuery } from "@tanstack/react-query";
import { doFetch } from "../util/api";
import { PermissionsResponseModel } from "../types";

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
export const usePermissionsQuery = (id: string, type: "team" | "folder") =>
  useQuery(["users", "permissions", type, id], async () => {
    return await doFetch<PermissionsResponseModel[]>(
      fetch(`/api/user/permissions/${type}/${id}`)
    );
  });
