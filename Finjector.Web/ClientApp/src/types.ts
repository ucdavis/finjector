export interface Coa {
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
  INVALID = "INVALID",
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  isPersonal: boolean;
  myTeamPermissions: string[];
}

export interface Folder {
  id: number;
  name: string;
  description?: string;
  teamId: number;
  teamName: string;
  myFolderPermissions: string[];
  myTeamPermissions: string[];
}

export type CollectionResourceType = "team" | "folder";

/* ----- Query specific response types ------- */

export interface NameAndDescriptionModel {
  name: string;
  description?: string;
}


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
  charts: Coa[];
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

export interface AeDetails {
  isValid: boolean;
  chartType: string;
  chartString: string;
  chartStringType: ChartType;
  errors: string[];
  warnings: string[];
  segmentDetails: SegmentDetails[];
  approvers: Approver[];
  hasWarnings: boolean;
  ppmDetails: PpmDetails;
}

export interface PpmDetails {
  ppmProjectManager: Approver;
  ppmGlString: string;
  projectStartDate: string;
  projectCompletionDate: string;
  projectStatus: string;
  projectTypeName: string;
}

export interface SegmentDetails {
  order: number;
  entity: string | null;
  code: string | null;
  name: string | null;
}

export interface Approver {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  name: string;
}
