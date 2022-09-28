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

export const fromPpmSegmentString = (segmentString: string): PpmSegments => {
  const segments = segmentString.split("-");

  // There are two possible PPM segment strings - either 4 or 6 segment varieties.
  const isRequiredOnly = segments.length;

  if (isRequiredOnly) {
    return {
      project: segments[0],
      task: segments[1],
      organization: segments[2],
      expenditureType: segments[3],
    };
  } else {
    return {
      project: segments[0],
      task: segments[1],
      organization: segments[2],
      expenditureType: segments[3],
      award: segments[4],
      fundingSource: segments[5],
    };
  }
};

export const fromGlSegmentString = (segmentString: string): GlSegments => {
  const segments = segmentString.split("-");

  return {
    entity: segments[0],
    fund: segments[1],
    department: segments[2],
    account: segments[3],
    purpose: segments[4],
    program: segments[5],
    project: segments[6],
    activity: segments[7],
    interEntity: segments[8],
    flex1: segments[9],
    flex2: segments[10],
  };
};