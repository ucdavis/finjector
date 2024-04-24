import { http, HttpResponse } from "msw";
import {
  fakeTeams,
  fakeFolders,
  fakeInvalidAeDetails,
  fakeValidChart,
  fakeValidAeDetails,
  fakeCharts,
  fakeTeamPermissionResponseModels,
  fakeFolderPermissionResponseModels,
} from "./mockData";
import { NameAndDescriptionModel } from "../../src/types";

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
  http.get("/api/team", () => {
    //console.log("In api/team/");
    return HttpResponse.json([
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
    ]);
  }),
  http.get("/api/team/:id", ({ params }) => {
    // console.log("fake teams", fakeTeams);
    // console.log("params", params);
    const teamId = params.id;
    const team = fakeTeams.find((t) => t.id === parseInt(teamId as string, 10));

    if (teamId === "99") {
      // console.log("Returning personal team");
      // console.log("fakeTeams[3]", fakeTeams[3]);
      return HttpResponse.json({
        team: fakeTeams[3],
        folders: [
          {
            folder: fakeFolders[3],
            chartCount: 1,
            uniqueUserPermissionCount: 3,
          },
        ],
      });
    }
    //console.log(`Returning team ${team?.name} `);
    return HttpResponse.json({
      team: team,
      folders: [
        { folder: fakeFolders[0], chartCount: 1, uniqueUserPermissionCount: 3 },
        { folder: fakeFolders[1], chartCount: 2, uniqueUserPermissionCount: 2 },
      ],
    });
  }),
  http.get("/api/folder/:id", ({ params }) => {
    const folderId = params.id;
    const folder = fakeFolders.find(
      (f) => f.id === parseInt(folderId as string, 10)
    );
    return HttpResponse.json({
      folder: folder,
      charts: fakeCharts,
    });
  }),
  http.get("/api/user/admins/:type/:id", ({ params }) => {
    //const id = params.id;
    const type = params.type;
    //console.log("In api/user/admins/:type/:id", id, type);
    if (type === "team") {
      //console.log(fakeTeamPermissionResponseModels);
      return HttpResponse.json(fakeTeamPermissionResponseModels);
    } else {
      //console.log(fakeFolderPermissionResponseModels);
      return HttpResponse.json(fakeFolderPermissionResponseModels);
    }
  }),
  http.post("/api/folder", async ({ request }) => {
    //console.log("request", request);

    //console.log("Url", request.url.toString());
    //get the value of the teamId query parameter
    const url = new URL(request.url);
    const teamId = url.searchParams.get("teamId");
    console.log("teamId", teamId);

    if (teamId === "999") {
      console.log("Returning error");
      return HttpResponse.error();
    }

    return HttpResponse.json(fakeFolders[0]);
  }),
  http.post("/api/folder/:folderId/leave", async ({ request }) => {
    const url = new URL(request.url);
    //console.log("url", url.pathname);
    const folderId = url.pathname.split("/").at(-2);
    console.log("folderId", folderId);
    if (folderId === "998") {
      console.log("Returning error");
      return HttpResponse.error();
    }
    return HttpResponse.json({});
  }),
  http.put("/api/folder/:id", async ({ request }) => {
    //console.log("request", request);

    //get the body
    const body = await request.json();
    //console.log("body", body);
    //get the name and description from the body source
    const { name } = body as NameAndDescriptionModel;
    console.log("name", name);
    if (name === "TEST ERROR") {
      console.log("Returning error");
      return HttpResponse.error();
    }

    return HttpResponse.json(fakeFolders[0]);
  }),
  http.delete("/api/folder/:id", async ({ request }) => {
    //get the id from the url
    const url = new URL(request.url);
    const folderId = url.pathname.split("/").pop();
    ///console.log("folderId", folderId);
    if (folderId === "999") {
      console.log("Returning error");
      return HttpResponse.error();
    }
    return HttpResponse.json({});
  }),
  http.post("/api/team", async ({ request }) => {
    //console.log("request", request);
    //get the body
    const body = await request.json();
    //console.log("body", body);
    //get the name and description from the body source
    const { name } = body as NameAndDescriptionModel;
    //console.log("name", name);
    if (name === "Personal") {
      console.log("Returning error");
      return HttpResponse.error();
    }

    return HttpResponse.json(fakeTeams[0]);
  }),
  http.put("/api/team/:id", async ({ request }) => {
    //console.log("request", request);

    //get the body
    const body = await request.json();
    //console.log("body", body);
    //get the name and description from the body source
    const { name } = body as NameAndDescriptionModel;
    //console.log("name", name);
    if (name === "TEST ERROR") {
      console.log("Returning error");
      return HttpResponse.error();
    }

    return HttpResponse.json(fakeTeams[0]);
  }),
];
