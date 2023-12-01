import React from "react";
import { renderNameAndEmail } from "../../util/util";
import { PpmDetails } from "../../types";
import CopyToClipboardHover from "../../shared/CopyToClipboardHover";
import { DetailsRow } from "./DetailsRow";

interface PpmDetailsProps {
  details: PpmDetails;
}

const PpmDetailsPage: React.FC<PpmDetailsProps> = ({ details }) => {
  return (
    <>
      <DetailsRow header="Project Manager">
        <CopyToClipboardHover
          value={details.ppmProjectManager.email ?? ""}
          id="ppmProjectManagerEmail"
        >
          {renderNameAndEmail(
            details.ppmProjectManager.name,
            details.ppmProjectManager.email
          )}
        </CopyToClipboardHover>
      </DetailsRow>
      <DetailsRow header="Project Type">
        <CopyToClipboardHover
          value={details.projectTypeName}
          id="projectTypeName"
        >
          {details.projectTypeName}
        </CopyToClipboardHover>
      </DetailsRow>
      <DetailsRow header="Project Start Date">
        <CopyToClipboardHover
          value={details.projectStartDate}
          id="projectStartDate"
        >
          {details.projectStartDate}
        </CopyToClipboardHover>
      </DetailsRow>
      <DetailsRow header="Project End Date">
        <CopyToClipboardHover
          value={details.projectCompletionDate}
          id="projectCompletionDate"
        >
          {details.projectCompletionDate}
        </CopyToClipboardHover>
      </DetailsRow>
      <DetailsRow header="Project Status">
        <CopyToClipboardHover value={details.projectStatus} id="projectStatus">
          {details.projectStatus}
        </CopyToClipboardHover>
      </DetailsRow>
    </>
  );
};

export default PpmDetailsPage;
