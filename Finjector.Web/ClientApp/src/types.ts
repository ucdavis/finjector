export interface Chart {
  id: number;
  segmentString: string;
  name: string;
  chartType: ChartType;
  folderId?: number;
  updated: Date;
}

export enum ChartType {
  GL = "GL",
  PPM = "PPM",
}

export interface Team {
  id: number;
  name: string;
}

export interface Folder {
  id: number;
  name: string;
  teamId: number;
  teamName: string;
  myFolderPermissions: string[];
  myTeamPermissions: string[];
}

/* ----- Query specific response types ------- */

export interface TeamsResponseModel {
  team: Team;
  folderCount: number;
  teamPermissionCount: number;
  folderPermissionCount: number;
  chartCount: number;
  admins: string[];
}

export interface TeamResponseModel {
  team: Team;
  folders: [
    {
      folder: Folder;
      chartCount: number;
      folderMemberCount: number;
    }
  ];
}

export interface FolderResponseModel {
  folder: Folder;
  charts: Chart[];
}

export interface PermissionsResponseModel {
  resourceName: string;
  roleName: string;
  userName: string;
  userEmail: string;
}

/* ----- End Query specific response types ------- */

export interface GlSegments {
  account: SegmentData;
  activity: SegmentData;
  department: SegmentData;
  entity: SegmentData;
  fund: SegmentData;
  program: SegmentData;
  project: SegmentData;
  purpose: SegmentData;
  interEntity: SegmentData;
  flex1: SegmentData;
  flex2: SegmentData;
}

export interface PpmSegments {
  project: SegmentData;
  task: SegmentData;
  organization: SegmentData;
  expenditureType: SegmentData;
  award: SegmentData;
  fundingSource: SegmentData;
}

export interface SegmentData {
  code: string;
  name: string;
  segmentName: string;
  default: string;
  isValid: boolean;
}

export interface ChartData {
  chartType: ChartType;
  glSegments: GlSegments;
  ppmSegments: PpmSegments;
}
