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
}

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
  chartStringType: ChartType;
  errors: string[];
  warnings: string[];
  segmentDetails: SegmentDetails[];
  approvers: Approver[];
  ppmProjectManager: Approver;
  ppmGlString: string;
  hasWarnings: boolean;
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
