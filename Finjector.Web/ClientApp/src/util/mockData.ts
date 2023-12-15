import { Coa, ChartType, Team, Folder } from "../types";

const fakeCharts: Coa[] = [];
const fakeTeams: Team[] = [];
const fakeFolders: Folder[] = [];

// make 3 fake teams
for (let i = 0; i < 3; i++) {
  fakeTeams.push({
    id: i,
    name: `Team ${i}`,
    description: `Team ${i} description`,
    isPersonal: false,
    myTeamPermissions: ["Admin", "Edit", "View"],
  });
}

// make 3 fake charts
for (let i = 0; i < 3; i++) {
  fakeCharts.push({
    id: i,
    name: `Chart ${i}`,
    segmentString:
      "3110-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000",
    chartType: ChartType.GL,
    folderId: 0,
    updated: new Date(),
  });
}

// make 3 fake folders
for (let i = 0; i < 3; i++) {
  fakeFolders.push({
    id: i,
    name: `Folder ${i}`,
    description: `Folder ${i} description`,
    teamId: 0,
    teamName: "Team 0",
    myFolderPermissions: ["Admin", "Edit", "View"],
    myTeamPermissions: ["Admin", "Edit", "View"],
    coas: [...fakeCharts],
    team: fakeTeams[0],
  });
}

export { fakeCharts, fakeFolders, fakeTeams };
