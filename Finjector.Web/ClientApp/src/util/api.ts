export const doFetch = async <T>(fetchCall: Promise<Response>): Promise<T> => {
  const res = await fetchCall;

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
};

export const authenticatedFetch = async (
  url: string,
  init?: RequestInit,
  additionalHeaders?: HeadersInit
): Promise<any> => {
  // ensure we have an XSRF token
  var response = await fetch("/api/antiforgery/token", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const xsrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (!xsrfToken) {
    throw new Error("XSRF Token not found");
  }

  return fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": xsrfToken,
      ...additionalHeaders,
    },
  });
};
