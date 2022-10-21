import { useQuery } from "@tanstack/react-query";

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
