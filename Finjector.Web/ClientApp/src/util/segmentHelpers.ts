import { GlSegments, PpmSegments } from "../types";
import { glSegmentDefaults, ppmSegmentDefaults } from "./segmentValidation";

export const buildInitialPpmSegments = (): PpmSegments => {
  return {
    project: getDefaultSegment(ppmSegmentDefaults.project),
    task: getDefaultSegment(ppmSegmentDefaults.task),
    organization: getDefaultSegment(ppmSegmentDefaults.organization),
    expenditureType: getDefaultSegment(ppmSegmentDefaults.expenditureType),
    award: getDefaultSegment(ppmSegmentDefaults.award),
    fundingSource: getDefaultSegment(ppmSegmentDefaults.fundingSource),
  };
};

export const buildInitialGlSegments = (): GlSegments => {
  return {
    account: getDefaultSegment(glSegmentDefaults.account),
    activity: getDefaultSegment(glSegmentDefaults.activity),
    department: getDefaultSegment(glSegmentDefaults.department),
    entity: getDefaultSegment(glSegmentDefaults.entity),
    fund: getDefaultSegment(glSegmentDefaults.fund),
    program: getDefaultSegment(glSegmentDefaults.program),
    project: getDefaultSegment(glSegmentDefaults.project),
    purpose: getDefaultSegment(glSegmentDefaults.purpose),
    interEntity: getDefaultSegment(glSegmentDefaults.interEntity),
    flex1: getDefaultSegment(glSegmentDefaults.flex1),
    flex2: getDefaultSegment(glSegmentDefaults.flex2),
  };
};

const getDefaultSegment = (defaultCode: string) => ({
  code: "",
  name: "",
  isValid: false,
  default: defaultCode,
});
