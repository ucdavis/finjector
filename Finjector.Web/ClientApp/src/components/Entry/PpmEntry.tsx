import React from "react";

import { ChartType, PpmSegments, SegmentData } from "../../types";
import {
  useDefaultExpenditureTypeQuery,
  useSegmentQuery,
} from "../../queries/segmentQueries";

import SegmentSearch from "./SegmentSearch";
import TaskSelector from "./TaskSelector";

interface Props {
  segments: PpmSegments;
  setSegment: (name: string, segment: SegmentData) => void;
}

const PpmEntry = (props: Props) => {
  const [selectedProject, setSelectedProject] =
    React.useState<SegmentData | null>(null);
  const [expenditureTypeProject, setExpenditureTypeProject] =
    React.useState<string | null>(null);
  const defaultExpenditureTypeQuery = useDefaultExpenditureTypeQuery(
    expenditureTypeProject
  );
  const departmentCode = selectedProject?.glPostingDepartmentCode?.trim() || "";
  const organizationQuery = useSegmentQuery(
    ChartType.PPM,
    "organization",
    departmentCode,
    "",
    1
  );

  React.useEffect(() => {
    if (!selectedProject) {
      return;
    }

    // Recheck after the lookup so a later project or manual entry takes priority.
    if (
      props.segments.organization.code ||
      props.segments.project.code !== selectedProject.code ||
      !props.segments.project.isValid
    ) {
      setSelectedProject(null);
      return;
    }

    const organization = organizationQuery.data?.find(
      (segment) => segment.code === departmentCode
    );
    if (organization) {
      props.setSegment("organization", {
        ...props.segments.organization,
        code: organization.code,
        name: organization.name,
        isValid: true,
      });
      setSelectedProject(null);
    } else if (organizationQuery.isSuccess || organizationQuery.isError) {
      setSelectedProject(null);
    }
  }, [
    props,
    selectedProject,
    departmentCode,
    organizationQuery.data,
    organizationQuery.isSuccess,
    organizationQuery.isError,
  ]);

  React.useEffect(() => {
    if (!expenditureTypeProject) {
      return;
    }

    if (
      props.segments.expenditureType.code ||
      props.segments.project.code !== expenditureTypeProject ||
      !props.segments.project.isValid
    ) {
      setExpenditureTypeProject(null);
      return;
    }

    // Wait for the current setting rather than applying a cached default.
    if (defaultExpenditureTypeQuery.isFetching) {
      return;
    }

    if (defaultExpenditureTypeQuery.isSuccess) {
      const expenditureType = defaultExpenditureTypeQuery.data[0];
      if (expenditureType) {
        props.setSegment("expenditureType", {
          ...props.segments.expenditureType,
          code: expenditureType.code,
          name: expenditureType.name,
          isValid: true,
        });
      }
      setExpenditureTypeProject(null);
    } else if (defaultExpenditureTypeQuery.isError) {
      setExpenditureTypeProject(null);
    }
  }, [
    props,
    expenditureTypeProject,
    defaultExpenditureTypeQuery.data,
    defaultExpenditureTypeQuery.isFetching,
    defaultExpenditureTypeQuery.isSuccess,
    defaultExpenditureTypeQuery.isError,
  ]);

  const updateSegment = (value: SegmentData) => {
    if (value.segmentName === "project") {
      setExpenditureTypeProject(
        value.isValid && !props.segments.expenditureType.code ? value.code : null
      );
      setSelectedProject(
        value.isValid &&
          value.glPostingDepartmentCode?.trim() &&
          !props.segments.organization.code
          ? value
          : null
      );
    } else if (value.segmentName === "organization") {
      setSelectedProject(null);
    } else if (value.segmentName === "expenditureType") {
      setExpenditureTypeProject(null);
    }
    props.setSegment(value.segmentName, value);
  };

  return (
    <div className="form-data-entry">
      <div className="row">
        <SegmentSearch
          chartType={ChartType.PPM}
          segmentData={props.segments.project}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <TaskSelector
          segmentData={props.segments.task}
          segmentDependency={props.segments.project}
          setSegmentValue={updateSegment}
        ></TaskSelector>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentData={props.segments.organization}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentData={props.segments.expenditureType}
          setSegmentValue={updateSegment}
        ></SegmentSearch>
      </div>
    </div>
  );
};

export default PpmEntry;
