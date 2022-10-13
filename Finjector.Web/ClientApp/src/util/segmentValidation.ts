import {
  ChartData,
  ChartType,
  GlSegments,
  PpmSegments,
  SegmentData,
} from "../types";

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
  if (!ppm.award.code && !ppm.fundingSource.code) {
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

export const getSegmentValue = (segment: SegmentData): string => {
  return segment.isValid ? segment.code : segment.default;
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
      project: {
        code: segments[0],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.project,
      },
      task: {
        code: segments[1],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.task,
      },
      organization: {
        code: segments[2],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.organization,
      },
      expenditureType: {
        code: segments[3],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.expenditureType,
      },
    };
  } else {
    return {
      project: {
        code: segments[0],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.project,
      },
      task: {
        code: segments[1],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.task,
      },
      organization: {
        code: segments[2],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.organization,
      },
      expenditureType: {
        code: segments[3],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.expenditureType,
      },
      award: {
        code: segments[4],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.award,
      },
      fundingSource: {
        code: segments[5],
        name: "",
        isValid: false,
        default: ppmSegmentDefaults.fundingSource,
      },
    };
  }
};

export const fromGlSegmentString = (segmentString: string): GlSegments => {
  const segments = segmentString.split("-");

  return {
    entity: {
      code: segments[0],
      name: "",
      isValid: false,
      default: glSegmentDefaults.entity,
    },
    fund: {
      code: segments[1],
      name: "",
      isValid: false,
      default: glSegmentDefaults.fund,
    },
    department: {
      code: segments[2],
      name: "",
      isValid: false,
      default: glSegmentDefaults.department,
    },
    account: {
      code: segments[3],
      name: "",
      isValid: false,
      default: glSegmentDefaults.account,
    },
    purpose: {
      code: segments[4],
      name: "",
      isValid: false,
      default: glSegmentDefaults.purpose,
    },
    program: {
      code: segments[5],
      name: "",
      isValid: false,
      default: glSegmentDefaults.program,
    },
    project: {
      code: segments[6],
      name: "",
      isValid: false,
      default: glSegmentDefaults.project,
    },
    activity: {
      code: segments[7],
      name: "",
      isValid: false,
      default: glSegmentDefaults.activity,
    },
    interEntity: {
      code: segments[8],
      name: "",
      isValid: false,
      default: glSegmentDefaults.interEntity,
    },
    flex1: {
      code: segments[9],
      name: "",
      isValid: false,
      default: glSegmentDefaults.flex1,
    },
    flex2: {
      code: segments[10],
      name: "",
      isValid: false,
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
