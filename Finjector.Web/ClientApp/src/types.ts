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

//   toSegmentString(): string {
//     return `${this.entity}-${this.fund}-${this.department}-${this.account}-${this.purpose}-${this.program}-${this.project}-${this.activity}-${this.interEntity}-${this.flex1}-${this.flex2}`;
//   }

export interface PpmSegments {
  project?: string;
  task?: string;
  organization?: string;
  expenditureType?: string;
  award?: string | null;
  fundingSource?: string | null;

  //   toSegmentString(): string {
  //     if (!this.award && !this.fundingSource) {
  //       return `${this.project}-${this.task}-${this.organization}-${this.expenditureType}`;
  //     }
  //     return `${this.project}-${this.task}-${this.organization}-${this.expenditureType}-${this.award}-${this.fundingSource}`;
  //   }
}
