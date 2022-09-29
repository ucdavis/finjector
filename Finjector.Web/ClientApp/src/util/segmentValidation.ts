import { GlSegments, PpmSegments } from "../types";

export const toGlSegmentString = (gl: GlSegments): string => {
  return `${gl.entity}-${gl.fund}-${gl.department}-${gl.account}-${gl.purpose}-${gl.program}-${gl.project}-${gl.activity}-${gl.interEntity}-${gl.flex1}-${gl.flex2}`;
};

export const toPpmSegmentString = (ppm: PpmSegments): string => {
  if (!ppm.award && !ppm.fundingSource) {
    return `${ppm.project}-${ppm.task}-${ppm.organization}-${ppm.expenditureType}`;
  }
  return `${ppm.project}-${ppm.task}-${ppm.organization}-${ppm.expenditureType}-${ppm.award}-${ppm.fundingSource}`;
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
