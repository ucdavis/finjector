export interface Chart {
  id: string;
  segmentString: string;
  displayName: string;
  chartType: ChartType;
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