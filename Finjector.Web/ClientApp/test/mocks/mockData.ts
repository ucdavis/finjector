import {
  Coa,
  ChartType,
  Team,
  Folder,
  AeDetails,
  PpmDetails,
  PermissionsResponseModel,
} from "../../src/types";

const fakeCharts: Coa[] = [];
const fakeTeams: Team[] = [];
const fakeFolders: Folder[] = [];
const fakeTeamPermissionResponseModels: PermissionsResponseModel[] = [];
const fakeFolderPermissionResponseModels: PermissionsResponseModel[] = [];

//make 3 fake permission response models
for (let i = 0; i < 3; i++) {
  fakeTeamPermissionResponseModels.push({
    level: "team",
    resourceName: `Team 1`,
    roleName: "Admin",
    userName: `User ${i}`,
    userEmail: `fake${i}@faker.com`,
  });
}
//Only Admin shows on view admins page
fakeTeamPermissionResponseModels.push({
  level: "team",
  resourceName: "Team 1",
  roleName: "Edit",
  userName: "User 3",
  userEmail: "fake4@faker.com",
});
fakeTeamPermissionResponseModels.push({
  level: "team",
  resourceName: "Team 1",
  roleName: "View",
  userName: "User 4",
  userEmail: "fake4@faker.com",
});

for (let i = 0; i < 3; i++) {
  fakeFolderPermissionResponseModels.push({
    level: "folder",
    resourceName: `Team 1 / Folder 1`,
    roleName: "Admin",
    userName: `User ${i}`,
    userEmail: `fake${i}@faker.com`,
  });
}

fakeFolderPermissionResponseModels.push({
  level: "team",
  resourceName: "Team 1 / Folder 1",
  roleName: "Admin",
  userName: "User 3",
  userEmail: "fake3@faker.com",
});

fakeFolderPermissionResponseModels.push({
  level: "folder",
  resourceName: "Team 1 / Folder 1",
  roleName: "Edit",
  userName: "User 4",
  userEmail: "fake4@faker.com",
});
fakeFolderPermissionResponseModels.push({
  level: "folder",
  resourceName: "Team 1 / Folder 1",
  roleName: "View",
  userName: "User 5",
  userEmail: "fake5@faker.com",
});

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

fakeTeams.push({
  id: 997,
  name: "Team 997",
  description: "Team 997 Error Testing",
  isPersonal: false,
  myTeamPermissions: ["Admin", "Edit", "View"],
});

fakeTeams.push({
  id: 998,
  name: "Team 998",
  description: "Team 998 Error Testing",
  isPersonal: false,
  myTeamPermissions: ["View"],
});

// make a team to return errors (BAD)
fakeTeams.push({
  id: 999,
  name: "Team 999",
  description: "Team 999 description",
  isPersonal: false,
  myTeamPermissions: ["Admin", "Edit", "View"],
});

//Permission specific teams
fakeTeams.push({
  id: 10,
  name: "Team 10",
  description: "Team 10 description with View permission only",
  isPersonal: false,
  myTeamPermissions: ["View"],
});
fakeTeams.push({
  id: 11,
  name: "Team 11",
  description: "Team 11 description with View and Edit permissions",
  isPersonal: false,
  myTeamPermissions: ["Edit", "View"],
});
fakeTeams.push({
  id: 12,
  name: "Team 12",
  description: "Team 12 description with Edit permission only",
  isPersonal: false,
  myTeamPermissions: ["Edit"],
});
fakeTeams.push({
  id: 13,
  name: "Team 13",
  description: "Team 13 description with Admin permission only",
  isPersonal: false,
  myTeamPermissions: ["Admin"],
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

fakeCharts.push({
  id: 98,
  name: "Chart 98",
  segmentString: "KL0733ATC1-TASK01-ADNO001-501090",
  chartType: ChartType.PPM,
  folderId: 0,
  updated: new Date(),
  teamName: "Team 0",
  canEdit: true,
});

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

fakeFolders.push({
  id: 99,
  name: "Default",
  isDefault: true,
  teamId: 99,
  teamName: "Personal",
  myFolderPermissions: ["Admin", "Edit", "View"],
  myTeamPermissions: ["Admin", "Edit", "View"],
  coas: [...fakeCharts],
});

// folders with different permissions
fakeFolders.push({
  id: 10,
  name: "Folder 10",
  description: "Folder 10 description with View permission only",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["View"],
  myTeamPermissions: ["View"],
  coas: [...fakeCharts],
});
fakeFolders.push({
  id: 11,
  name: "Folder 11",
  description: "Folder 11 description with View and Edit permissions",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["Edit", "View"],
  myTeamPermissions: ["Edit", "View"],
  coas: [...fakeCharts],
});
fakeFolders.push({
  id: 12,
  name: "Folder 12",
  description: "Folder 12 description with Edit permission only",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["Edit"],
  myTeamPermissions: ["Edit"],
  coas: [...fakeCharts],
});
fakeFolders.push({
  id: 13,
  name: "Folder 13",
  description: "Folder 13 description with Admin permission only",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["Admin"],
  myTeamPermissions: ["Admin"],
  coas: [...fakeCharts],
});
fakeFolders.push({
  id: 14,
  name: "Folder 14",
  description:
    "Folder 14 description with Admin team and view folder permission only",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["View"],
  myTeamPermissions: ["Admin"],
  coas: [...fakeCharts],
});

fakeFolders.push({
  id: 15,
  name: "Folder 15",
  description:
    "Folder 15 description with Edit team and view folder permission only",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["View"],
  myTeamPermissions: ["Edit"],
  coas: [...fakeCharts],
});

fakeFolders.push({
  id: 999,
  name: "Folder 999",
  description: "Folder 999 for testing errors",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["Admin"],
  myTeamPermissions: ["Admin"],
  coas: [...fakeCharts],
});

fakeFolders.push({
  id: 998,
  name: "Folder 998",
  description: "Folder 998 for testing errors",
  isDefault: false,
  teamId: 0,
  teamName: "Team 0",
  myFolderPermissions: ["View"],
  myTeamPermissions: ["View"],
  coas: [...fakeCharts],
});

const fakePpmDetails: PpmDetails = {
  ppmGlString: "GL123456",
  projectStartDate: "2022-01-01",
  projectCompletionDate: "2022-12-31",
  projectStatus: "In Progress",
  projectTypeName: "New Project",
  poetString: "Fake-POET-String",
  glRevenueTransferString: "Fake-Gl-Transfer-String",
  projectDescription: "This is a fake project description.",
  roles: [
    {
      order: 1,
      roleName: "Role 1",
      type: "P",
      approvers: [
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "test@test.com",
          name: "Smith, Jane",
        },
      ],
    },
  ],
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
    ppmGlString: "GL654321",
    projectStartDate: "2022-01-01",
    projectCompletionDate: "2022-12-31",
    projectStatus: "In Progress",
    projectTypeName: "New Project",
    poetString: "Fake-POET-String",
    glRevenueTransferString: "Fake-Gl-Transfer-String",
    projectDescription: "This is a fake project description.",
    roles: [
      {
        order: 1,
        roleName: "Role 1",
        type: "P",
        approvers: [
          {
            firstName: "Jane",
            lastName: "Smith",
            email: "test@test.com",
            name: "Smith, Jane",
          },
        ],
      },
    ],
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
    ppmGlString: "GL654321",
    projectStartDate: "2022-01-01",
    projectCompletionDate: "2022-12-31",
    projectStatus: "In Progress",
    projectTypeName: "New Project",
    poetString: "Fake-POET-String",
    glRevenueTransferString: "Fake-Gl-Transfer-String",
    projectDescription: "This is a fake project description.",
    roles: [
      {
        order: 1,
        roleName: "Role 1",
        type: "P",
        approvers: [
          {
            firstName: "Jane",
            lastName: "Smith",
            email: "test@test.com",
            name: "Smith, Jane",
          },
        ],
      },
    ],
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
  fakeTeamPermissionResponseModels,
  fakeFolderPermissionResponseModels,
};
