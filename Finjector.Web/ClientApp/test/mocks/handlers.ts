import { http, HttpResponse } from "msw";
import {
  fakeTeams,
  fakeFolders,
  fakeInvalidAeDetails,
  fakeValidChart,
  fakeValidAeDetails,
} from "./mockData";

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
  http.get("/api/charts/details/string", ({ request }) => {
    const url = new URL(request.url);
    const segmentString = url.searchParams.get("chartString");

    let aeDetailsToUse = fakeInvalidAeDetails;

    if (segmentString === fakeValidChart.segmentString) {
      aeDetailsToUse = fakeValidAeDetails;
    }

    return HttpResponse.json({
      aeDetails: aeDetailsToUse,
    });
  }),
  http.get("/api/team", () =>
    HttpResponse.json([
      {
        team: fakeTeams[1],
        folderCount: 3,
        uniqueUserPermissionCount: 2,
        chartCount: 4,
        admins: ["Fake User1", "Fake User2"],
      },
      {
        team: fakeTeams[0],
        folderCount: 1,
        uniqueUserPermissionCount: 3,
        chartCount: 1,
        admins: ["Fake User1", "Fake User3"],
      },
    ])
  ),
];
