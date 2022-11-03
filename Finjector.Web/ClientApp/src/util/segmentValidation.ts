import {
  ChartData,
  ChartType,
  GlSegments,
  PpmSegments,
  SegmentData,
} from "../types";
import {
  buildInitialGlSegments,
  buildInitialPpmSegments,
} from "./segmentHelpers";

export const toGlSegmentString = (gl: GlSegments): string => {
  return `${getSegmentValue(gl.entity)}-${getSegmentValue(
    gl.fund
  )}-${getSegmentValue(gl.department)}-${getSegmentValue(
    gl.account
  )}-${getSegmentValue(gl.purpose)}-${getSegmentValue(
    gl.program
  )}-${getSegmentValue(gl.project)}-${getSegmentValue(
    gl.activity
  )}-${getSegmentValue(gl.interEntity)}-${getSegmentValue(
    gl.flex1
  )}-${getSegmentValue(gl.flex2)}`;
};

export const toPpmSegmentString = (ppm: PpmSegments): string => {
  if (isPpmWithoutAward(ppm)) {
    return `${getSegmentValue(ppm.project)}-${getSegmentValue(
      ppm.task
    )}-${getSegmentValue(ppm.organization)}-${getSegmentValue(
      ppm.expenditureType
    )}`;
  }
  return `${getSegmentValue(ppm.project)}-${getSegmentValue(
    ppm.task
  )}-${getSegmentValue(ppm.organization)}-${getSegmentValue(
    ppm.expenditureType
  )}-${getSegmentValue(ppm.award)}-${getSegmentValue(ppm.fundingSource)}`;
};

const isPpmWithoutAward = (ppm: PpmSegments): boolean => {
  return !ppm.award.code && !ppm.fundingSource.code;
};

export const isGlSegmentString = (segmentString: string): boolean => {
  return segmentString.split("-").length === 11;
};

export const getSegmentValue = (segment: SegmentData): string => {
  return segment.isValid ? segment.code : segment.default;
};

export const chartDataValid = (chartData: ChartData): boolean => {
  if (chartData.chartType === ChartType.GL) {
    return glSegmentsValid(chartData.glSegments);
  }
  return ppmSegmentsValid(chartData.ppmSegments);
};

// TODO: validate segment length, make sure not undefined
export const ppmSegmentsValid = (ppmSegments: PpmSegments): boolean => {
  if (isPpmWithoutAward(ppmSegments)) {
    return (
      ppmSegments.project.isValid &&
      ppmSegments.task.isValid &&
      ppmSegments.organization.isValid &&
      ppmSegments.expenditureType.isValid
    );
  } else {
    return (
      ppmSegments.project.isValid &&
      ppmSegments.task.isValid &&
      ppmSegments.organization.isValid &&
      ppmSegments.expenditureType.isValid &&
      ppmSegments.award.isValid &&
      ppmSegments.fundingSource.isValid
    );
  }
};

export const glSegmentsValid = (glSegments: GlSegments): boolean => {
  return (
    glSegments.entity.isValid &&
    glSegments.fund.isValid &&
    glSegments.department.isValid &&
    glSegments.account.isValid &&
    glSegments.purpose.isValid &&
    glSegments.program.isValid &&
    glSegments.project.isValid &&
    glSegments.activity.isValid &&
    glSegments.interEntity.isValid &&
    glSegments.flex1.isValid &&
    glSegments.flex2.isValid
  );
};

export const toSegmentString = (chartData: ChartData): string => {
  const { chartType, glSegments, ppmSegments } = chartData;
  return chartType === ChartType.GL
    ? toGlSegmentString(glSegments)
    : toPpmSegmentString(ppmSegments);
};

export const fromPpmSegmentString = (
  segmentString: string,
  validity: boolean = false
): PpmSegments => {
  const segments = segmentString.split("-");

  // There are two possible PPM segment strings - either 4 or 6 segment varieties.

  if (segments.length !== 4 && segments.length !== 6) {
    return buildInitialPpmSegments();
  }

  const isRequiredOnly = segments.length;

  if (isRequiredOnly) {
    return {
      project: {
        code: segments[0],
        name: "",
        segmentName: "project",
        isValid: validity,
        default: ppmSegmentDefaults.project,
      },
      task: {
        code: segments[1],
        name: "",
        segmentName: "task",
        isValid: validity,
        default: ppmSegmentDefaults.task,
      },
      organization: {
        code: segments[2],
        name: "",
        segmentName: "organization",
        isValid: validity,
        default: ppmSegmentDefaults.organization,
      },
      expenditureType: {
        code: segments[3],
        name: "",
        segmentName: "expenditureType",
        isValid: validity,
        default: ppmSegmentDefaults.expenditureType,
      },
      award: {
        code: "",
        name: "",
        segmentName: "award",
        isValid: true, // always valid with required only
        default: ppmSegmentDefaults.award,
      },
      fundingSource: {
        code: "",
        name: "",
        segmentName: "fundingSource",
        isValid: true,
        default: ppmSegmentDefaults.fundingSource,
      },
    };
  } else {
    return {
      project: {
        code: segments[0],
        name: "",
        segmentName: "project",
        isValid: validity,
        default: ppmSegmentDefaults.project,
      },
      task: {
        code: segments[1],
        name: "",
        segmentName: "task",
        isValid: validity,
        default: ppmSegmentDefaults.task,
      },
      organization: {
        code: segments[2],
        name: "",
        segmentName: "organization",
        isValid: validity,
        default: ppmSegmentDefaults.organization,
      },
      expenditureType: {
        code: segments[3],
        name: "",
        segmentName: "expenditureType",
        isValid: validity,
        default: ppmSegmentDefaults.expenditureType,
      },
      award: {
        code: segments[4],
        name: "",
        segmentName: "award",
        isValid: validity,
        default: ppmSegmentDefaults.award,
      },
      fundingSource: {
        code: segments[5],
        name: "",
        segmentName: "fundingSource",
        isValid: validity,
        default: ppmSegmentDefaults.fundingSource,
      },
    };
  }
};

export const fromGlSegmentString = (
  segmentString: string,
  validity: boolean = false
): GlSegments => {
  const segments = segmentString.split("-");

  if (segments.length !== 11) {
    return buildInitialGlSegments();
  }

  return {
    entity: {
      code: segments[0],
      name: "",
      segmentName: "entity",
      isValid: validity,
      default: glSegmentDefaults.entity,
    },
    fund: {
      code: segments[1],
      name: "",
      segmentName: "fund",
      isValid: validity,
      default: glSegmentDefaults.fund,
    },
    department: {
      code: segments[2],
      name: "",
      segmentName: "department",
      isValid: validity,
      default: glSegmentDefaults.department,
    },
    account: {
      code: segments[3],
      name: "",
      segmentName: "account",
      isValid: validity,
      default: glSegmentDefaults.account,
    },
    purpose: {
      code: segments[4],
      name: "",
      segmentName: "purpose",
      isValid: validity,
      default: glSegmentDefaults.purpose,
    },
    program: {
      code: segments[5],
      name: "",
      segmentName: "program",
      isValid: validity,
      default: glSegmentDefaults.program,
    },
    project: {
      code: segments[6],
      name: "",
      segmentName: "project",
      isValid: validity,
      default: glSegmentDefaults.project,
    },
    activity: {
      code: segments[7],
      name: "",
      segmentName: "activity",
      isValid: validity,
      default: glSegmentDefaults.activity,
    },
    interEntity: {
      code: segments[8],
      name: "",
      segmentName: "interEntity",
      isValid: true, // always valid, as are the two flex segments
      default: glSegmentDefaults.interEntity,
    },
    flex1: {
      code: segments[9],
      name: "",
      segmentName: "flex1",
      isValid: true,
      default: glSegmentDefaults.flex1,
    },
    flex2: {
      code: segments[10],
      name: "",
      segmentName: "flex2",
      isValid: true,
      default: glSegmentDefaults.flex2,
    },
  };
};

export const glSegmentDefaults: { [index: string]: string } = {
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

export const ppmSegmentDefaults: { [index: string]: string } = {
  project: "0000000000",
  task: "000000",
  organization: "0000000",
  expenditureType: "000000",
  award: "0000000",
  fundingSource: "00000",
};
