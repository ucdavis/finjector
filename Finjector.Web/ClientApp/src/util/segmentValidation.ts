import { ChartData, ChartType, GlSegments, PpmSegments } from "../types";

export const toGlSegmentString = (gl: GlSegments): string => {
  return `${gl.entity.code || glSegmentDefaults.entity}-${
    gl.fund.code || glSegmentDefaults.fund
  }-${gl.department.code || glSegmentDefaults.department}-${
    gl.account.code || glSegmentDefaults.account
  }-${gl.purpose.code || glSegmentDefaults.purpose}-${
    gl.program.code || glSegmentDefaults.program
  }-${gl.project.code || glSegmentDefaults.project}-${
    gl.activity.code || glSegmentDefaults.activity
  }-${gl.interEntity.code || glSegmentDefaults.interEntity}-${
    gl.flex1.code || glSegmentDefaults.flex1
  }-${gl.flex2.code || glSegmentDefaults.flex2}`;
};

export const toPpmSegmentString = (ppm: PpmSegments): string => {
  if (!ppm.award.code && !ppm.fundingSource.code) {
    return `${ppm.project.code || ppmSegmentDefaults.project}-${
      ppm.task.code || ppmSegmentDefaults.task
    }-${ppm.organization.code || ppmSegmentDefaults.organization}-${
      ppm.expenditureType.code || ppmSegmentDefaults.expenditureType
    }`;
  }
  return `${ppm.project.code || ppmSegmentDefaults.project}-${
    ppm.task.code || ppmSegmentDefaults.task
  }-${ppm.organization.code || ppmSegmentDefaults.organization}-${
    ppm.expenditureType || ppmSegmentDefaults.expenditureType
  }-${ppm.award || ppmSegmentDefaults.award}-${
    ppm.fundingSource.code || ppmSegmentDefaults.fundingSource
  }`;
};

export const toSegmentString = (chartData: ChartData): string => {
  const { chartType, glSegments, ppmSegments } = chartData;
  return chartType === ChartType.GL
    ? toGlSegmentString(glSegments)
    : toPpmSegmentString(ppmSegments);
};

export const fromPpmSegmentString = (
  segmentString: string
): Partial<PpmSegments> => {
  const segments = segmentString.split("-");

  // There are two possible PPM segment strings - either 4 or 6 segment varieties.
  const isRequiredOnly = segments.length;

  if (isRequiredOnly) {
    return {
      project: { code: segments[0], name: "" },
      task: { code: segments[1], name: "" },
      organization: { code: segments[2], name: "" },
      expenditureType: { code: segments[3], name: "" },
    };
  } else {
    return {
      project: { code: segments[0], name: "" },
      task: { code: segments[1], name: "" },
      organization: { code: segments[2], name: "" },
      expenditureType: { code: segments[3], name: "" },
      award: { code: segments[4], name: "" },
      fundingSource: { code: segments[5], name: "" },
    };
  }
};

export const fromGlSegmentString = (segmentString: string): GlSegments => {
  const segments = segmentString.split("-");

  return {
    entity: { code: segments[0], name: "" },
    fund: { code: segments[1], name: "" },
    department: { code: segments[2], name: "" },
    account: { code: segments[3], name: "" },
    purpose: { code: segments[4], name: "" },
    program: { code: segments[5], name: "" },
    project: { code: segments[6], name: "" },
    activity: { code: segments[7], name: "" },
    interEntity: { code: segments[8], name: "" },
    flex1: { code: segments[9], name: "" },
    flex2: { code: segments[10], name: "" },
  };
};

export const glSegmentDefaults = {
  entity: "0000",
  fund: "00000",
  department: "0000000",
  account: "000000",
  purpose: "00",
  program: "000",
  project: "0000000000",
  activity: "000000",
  interEntity: "0000",
  flex1: "000000",
  flex2: "000000",
};

export const ppmSegmentDefaults = {
  project: "0000000000",
  task: "000000",
  organization: "0000000",
  expenditureType: "000000",
  award: "0000000",
  fundingSource: "00000",
};
