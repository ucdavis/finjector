import { http, HttpResponse } from "msw";
import { fakeCharts, fakeTeams, fakeFolders } from "./mockData";

export const handlers = [
  // http.get("/api/charts/all", () => HttpResponse.json(fakeCharts)),
  http.get("/api/user/info", () => HttpResponse.json({})),
  http.get("/api/charts/all", () =>
    HttpResponse.json([
      {
        team: fakeTeams[0],
        folders: [fakeFolders[0]],
      },
    ])
  ),
];
