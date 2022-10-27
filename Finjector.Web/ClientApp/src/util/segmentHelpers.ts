import { GlSegments, PpmSegments } from "../types";
import { glSegmentDefaults, ppmSegmentDefaults } from "./segmentValidation";

// award and fund default to valid even if they are empty
export const buildInitialPpmSegments = (): PpmSegments => {
  return {
    project: getDefaultSegment(ppmSegmentDefaults.project),
    task: getDefaultSegment(ppmSegmentDefaults.task),
    organization: getDefaultSegment(ppmSegmentDefaults.organization),
    expenditureType: getDefaultSegment(ppmSegmentDefaults.expenditureType),
    award: getDefaultSegment(ppmSegmentDefaults.award, true),
    fundingSource: getDefaultSegment(ppmSegmentDefaults.fundingSource, true),
  };
};

// interEntity and flex default to valid even if they are empty
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
    interEntity: getDefaultSegment(glSegmentDefaults.interEntity, true, true),
    flex1: getDefaultSegment(glSegmentDefaults.flex1, true, true),
    flex2: getDefaultSegment(glSegmentDefaults.flex2, true, true),
  };
};

const getDefaultSegment = (
  defaultCode: string,
  defaultValid: boolean = false,
  setDefaultCode: boolean = false
) => ({
  code: setDefaultCode ? defaultCode : "",
  name: "",
  isValid: defaultValid,
  default: defaultCode,
});
