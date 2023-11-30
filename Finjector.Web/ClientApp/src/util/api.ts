export const doFetch = async <T>(fetchCall: Promise<Response>): Promise<T> => {
  const res = await fetchCall;

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
};

// This is a version of doFetch that doesn't expect a response body
export const doFetchEmpty = async <T>(
  fetchCall: Promise<Response>
): Promise<void> => {
  const res = await fetchCall;

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return;
};
