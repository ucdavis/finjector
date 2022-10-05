import { ChartData, ChartType, GlSegments, PpmSegments } from "../types";

export const toGlSegmentString = (gl: GlSegments): string => {
  return `${gl.entity.code}-${gl.fund.code}-${gl.department.code}-${gl.account.code}-${gl.purpose.code}-${gl.program.code}-${gl.project.code}-${gl.activity.code}-${gl.interEntity.code}-${gl.flex1.code}-${gl.flex2.code}`;
};

export const toPpmSegmentString = (ppm: PpmSegments): string => {
  if (!ppm.award.code && !ppm.fundingSource.code) {
    return `${ppm.project.code}-${ppm.task.code}-${ppm.organization.code}-${ppm.expenditureType.code}`;
  }
  return `${ppm.project.code}-${ppm.task.code}-${ppm.organization.code}-${ppm.expenditureType}-${ppm.award}-${ppm.fundingSource.code}`;
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
