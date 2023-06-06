import nock from "nock";

const apiBaseOrigin = "http://localhost";

export const mockApi = (apiBase: string = apiBaseOrigin) =>
  nock(apiBase);

export const cleanupApiMocks = () => nock.restore();
