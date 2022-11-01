import { GlSegments, PpmSegments } from "../types";
import { glSegmentDefaults, ppmSegmentDefaults } from "./segmentValidation";

// award and fund default to valid even if they are empty
export const buildInitialPpmSegments = (): PpmSegments => {
  return {
    project: getDefaultSegment(ppmSegmentDefaults.project, "project"),
    task: getDefaultSegment(ppmSegmentDefaults.task, "task"),
    organization: getDefaultSegment(ppmSegmentDefaults.organization, "organization"),
    expenditureType: getDefaultSegment(ppmSegmentDefaults.expenditureType, "expenditureType"),
    award: getDefaultSegment(ppmSegmentDefaults.award, "award", true),
    fundingSource: getDefaultSegment(ppmSegmentDefaults.fundingSource, "fundingSource", true),
  };
};

// interEntity and flex default to valid even if they are empty
export const buildInitialGlSegments = (): GlSegments => {
  return {
    account: getDefaultSegment(glSegmentDefaults.account, "account"),
    activity: getDefaultSegment(glSegmentDefaults.activity, "activity"),
    department: getDefaultSegment(glSegmentDefaults.department, "department"),
    entity: getDefaultSegment(glSegmentDefaults.entity, "entity"),
    fund: getDefaultSegment(glSegmentDefaults.fund, "fund", true),
    program: getDefaultSegment(glSegmentDefaults.program, "program"),
    project: getDefaultSegment(glSegmentDefaults.project, "project"),
    purpose: getDefaultSegment(glSegmentDefaults.purpose, "purpose"),
    interEntity: getDefaultSegment(glSegmentDefaults.interEntity, "interEntity", true, true),
    flex1: getDefaultSegment(glSegmentDefaults.flex1, "flex1", true, true),
    flex2: getDefaultSegment(glSegmentDefaults.flex2, "flex2", true, true),
  };
};

const getDefaultSegment = (
  defaultCode: string,
  segmentName: string,
  defaultValid: boolean = false,
  setDefaultCode: boolean = false
) => ({
  code: setDefaultCode ? defaultCode : "",
  name: "",
  segmentName,
  isValid: defaultValid,
  default: defaultCode,
});
