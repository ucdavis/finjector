export interface Chart {
  segmentString: string;
  displayName: string;
  chartType: ChartType;
}

export enum ChartType {
  GL = "GL",
  PPM = "PPM",
}

export interface GlSegments {
  account?: string;
  activity?: string;
  department?: string;
  entity?: string;
  fund?: string;
  program?: string;
  project?: string;
  purpose?: string;
  interEntity?: string;
  flex1?: string;
  flex2?: string;
}

export interface PpmSegments {
  project?: string;
  task?: string;
  organization?: string;
  expenditureType?: string;
  award?: string | null;
  fundingSource?: string | null;
}
