import {
  Coa,
  ChartType,
  Team,
  Folder,
  AeDetails,
  PpmDetails,
} from "../../src/types";

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

// make a personal team
fakeTeams.push({
  id: 99,
  name: "Personal",
  isPersonal: true,
  myTeamPermissions: ["Admin", "Edit", "View"],
});

// make 3 fake charts
for (let i = 0; i < 3; i++) {
  fakeCharts.push({
    id: i,
    name: `Chart ${i}`,
    segmentString: `311${i}-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000`,
    chartType: ChartType.GL,
    folderId: 0,
    updated: new Date(),
    teamName: "Team 0",
    canEdit: true,
  });
}

// make 3 fake folders
for (let i = 0; i < 3; i++) {
  fakeFolders.push({
    id: i,
    name: `Folder ${i}`,
    description: `Folder ${i} description`,
    isDefault: false,
    teamId: 0,
    teamName: "Team 0",
    myFolderPermissions: ["Admin", "Edit", "View"],
    myTeamPermissions: ["Admin", "Edit", "View"],
    coas: [...fakeCharts],
  });
}

const fakePpmDetails: PpmDetails = {
  ppmProjectManager: {
    name: "John Doe",
    email: "jdoe@fake.com",
    firstName: "John",
    lastName: "Doe",
  },
  ppmGlString: "GL123456",
  projectStartDate: "2022-01-01",
  projectCompletionDate: "2022-12-31",
  projectStatus: "In Progress",
  projectTypeName: "New Project",
};

// let's just assign the first chart to be valid and the second to be invalid
const fakeValidChart = { ...fakeCharts[0] };
const fakeInvalidChart = { ...fakeCharts[1] };

const fakeInvalidAeDetails: AeDetails = {
  isValid: false,
  chartType: "GL",
  chartString:
    "3110-73830-BSDF001-480000-00-000-0000000000-000000-0000-000000-000000",
  chartStringType: ChartType.GL,
  errors: ["GL segment fund (73830) does not exist."],
  warnings: [],
  segmentDetails: [
    {
      order: 1,
      entity: "Entity",
      code: "3110",
      name: "UC Davis Campus",
    },
    {
      order: 2,
      entity: "Fund",
      code: "73830",
      name: null,
    },
    {
      order: 3,
      entity: "Department",
      code: "BSDF001",
      name: "CBS Deans Office Administration",
    },
    {
      order: 4,
      entity: "Account",
      code: "480000",
      name: "Current Use Gift Revenue",
    },
    {
      order: 5,
      entity: "Purpose",
      code: "00",
      name: "Purpose Default",
    },
    {
      order: 6,
      entity: "Program",
      code: "000",
      name: "Default Program Value",
    },
    {
      order: 7,
      entity: "Project",
      code: "0000000000",
      name: "Default Project",
    },
    {
      order: 8,
      entity: "Activity",
      code: "000000",
      name: "Default Activity Value",
    },
  ],
  approvers: [
    {
      firstName: "John",
      lastName: "Doe",
      email: "jdoe@fake.com",
      name: "Doe, John",
    },
  ],
  ppmDetails: {
    ppmProjectManager: {
      name: "Jane Smith",
      email: "jsmith@fake.com",
      firstName: "Jane",
      lastName: "Smith",
    },
    ppmGlString: "GL654321",
    projectStartDate: "2022-01-01",
    projectCompletionDate: "2022-12-31",
    projectStatus: "In Progress",
    projectTypeName: "New Project",
  },
  hasWarnings: false,
};

const fakeValidAeDetails: AeDetails = {
  isValid: true,
  chartType: "GL",
  chartString: fakeValidChart.segmentString,
  chartStringType: ChartType.GL,
  errors: [],
  warnings: [],
  segmentDetails: [
    {
      order: 1,
      entity: "Entity",
      code: "3110",
      name: "UC Davis Campus",
    },
    {
      order: 2,
      entity: "Fund",
      code: "73830",
      name: null,
    },
    {
      order: 3,
      entity: "Department",
      code: "BSDF001",
      name: "CBS Deans Office Administration",
    },
    {
      order: 4,
      entity: "Account",
      code: "480000",
      name: "Current Use Gift Revenue",
    },
    {
      order: 5,
      entity: "Purpose",
      code: "00",
      name: "Purpose Default",
    },
    {
      order: 6,
      entity: "Program",
      code: "000",
      name: "Default Program Value",
    },
    {
      order: 7,
      entity: "Project",
      code: "0000000000",
      name: "Default Project",
    },
    {
      order: 8,
      entity: "Activity",
      code: "000000",
      name: "Default Activity Value",
    },
  ],
  approvers: [
    {
      firstName: "John",
      lastName: "Doe",
      email: "jdoe@fake.com",
      name: "Doe, John",
    },
  ],
  ppmDetails: {
    ppmProjectManager: {
      name: "Jane Smith",
      email: "jsmith@fake.com",
      firstName: "Jane",
      lastName: "Smith",
    },
    ppmGlString: "GL654321",
    projectStartDate: "2022-01-01",
    projectCompletionDate: "2022-12-31",
    projectStatus: "In Progress",
    projectTypeName: "New Project",
  },
  hasWarnings: false,
};

export {
  fakeCharts,
  fakeFolders,
  fakeTeams,
  fakePpmDetails,
  fakeValidChart,
  fakeInvalidChart,
  fakeInvalidAeDetails,
  fakeValidAeDetails,
};
