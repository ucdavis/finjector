export const doFetch = async <T>(fetchCall: Promise<Response>): Promise<T> => {
  const res = await fetchCall;

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
};
