import React from "react";
import { renderNameAndEmail } from "../../util/util";
import { PpmDetails } from "../../types";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import { DetailsRow } from "./DetailsRow";

interface PpmDetailsProps {
  details: PpmDetails;
}

const PpmDetailsPage: React.FC<PpmDetailsProps> = ({ details }) => {
  return (
    <>
      <DetailsRow
        headerColText="Project Manager"
        column2={
          <CopyToClipboardHover
            value={details.ppmProjectManager.email ?? ""}
            id="ppmProjectManagerEmail"
          >
            {renderNameAndEmail(
              details.ppmProjectManager.name,
              details.ppmProjectManager.email
            )}
          </CopyToClipboardHover>
        }
      />
      <DetailsRow
        headerColText="Project Type"
        column2={
          <CopyToClipboardHover
            value={details.projectTypeName}
            id="projectTypeName"
          >
            {details.projectTypeName}
          </CopyToClipboardHover>
        }
      />
      <DetailsRow
        headerColText="Project Start Date"
        column2={
          <CopyToClipboardHover
            value={details.projectStartDate}
            id="projectStartDate"
          >
            {details.projectStartDate}
          </CopyToClipboardHover>
        }
      />
      <DetailsRow
        headerColText="Project End Date"
        column2={
          <CopyToClipboardHover
            value={details.projectCompletionDate}
            id="projectCompletionDate"
          >
            {details.projectCompletionDate}
          </CopyToClipboardHover>
        }
      />
      <DetailsRow
        headerColText="Project Status"
        column2={
          <CopyToClipboardHover
            value={details.projectStatus}
            id="projectStatus"
          >
            {details.projectStatus}
          </CopyToClipboardHover>
        }
      />
      <DetailsRow
        headerColText="POETAF String"
        column2={
          <CopyToClipboardHover value={details.poetString} id="poetString">
            {details.poetString}
          </CopyToClipboardHover>
        }
      />
    </>
  );
};

export default PpmDetailsPage;
