export interface Chart {
  segmentString: string;
  displayName: string;
  chartType: ChartType;
}

export enum ChartType {
  GL = "GL",
  PPM = "PPM",
}
