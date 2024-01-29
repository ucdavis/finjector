import { UnauthorizedError } from "./error";

export const doFetch = async <T>(fetchCall: Promise<Response>): Promise<T> => {
  const res = await fetchCall;

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(UnauthorizedError);
    }
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
};

// This is a version of doFetch that doesn't expect a response body
export const doFetchEmpty = async (
  fetchCall: Promise<Response>
): Promise<void> => {
  const res = await fetchCall;

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(UnauthorizedError);
    }
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return;
};

export const doErrorFetch = async <T>(
  fetchCall: Promise<Response>
): Promise<T> => {
  console.warn("you are calling doErrorFetch instead of doFetch");

  await new Promise((resolve) => setTimeout(resolve, 3000));
  throw new Error(UnauthorizedError);
};

export const doSlowFetch = async <T>(
  fetchCall: Promise<Response>
): Promise<T> => {
  console.warn("you are calling doSlowFetch instead of doFetch");

  await new Promise((resolve) => setTimeout(resolve, 3000));
  return await doFetch(fetchCall);
};
