import { GlSegments, PpmSegments } from "../types";

export const buildInitialPpmSegments = (): PpmSegments => {
  return {
    project: getDefaultSegment(),
    task: getDefaultSegment(),
    organization: getDefaultSegment(),
    expenditureType: getDefaultSegment(),
    award: getDefaultSegment(),
    fundingSource: getDefaultSegment(),
  };
};

export const buildInitialGlSegments = (): GlSegments => {
  return {
    account: getDefaultSegment(),
    activity: getDefaultSegment(),
    department: getDefaultSegment(),
    entity: getDefaultSegment(),
    fund: getDefaultSegment(),
    program: getDefaultSegment(),
    project: getDefaultSegment(),
    purpose: getDefaultSegment(),
    interEntity: getDefaultSegment(),
    flex1: getDefaultSegment(),
    flex2: getDefaultSegment(),
  };
};

const getDefaultSegment = () => ({ code: "", name: "" });
