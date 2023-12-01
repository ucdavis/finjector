import React from "react";
import { renderNameAndEmail } from "../../util/util";
import { PpmDetails } from "../../types";
import CopyToClipboardHover from "../../shared/CopyToClipboardHover";

interface PpmDetailsProps {
  details: PpmDetails;
}

const PpmDetailsPage: React.FC<PpmDetailsProps> = ({ details }) => {
  return (
    <>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Manager</h4>
        </div>
        <div className="col coa-details-info-right">
          <CopyToClipboardHover
            value={details.ppmProjectManager.email ?? ""}
            id="ppmProjectManagerEmail"
          >
            {renderNameAndEmail(
              details.ppmProjectManager.name,
              details.ppmProjectManager.email
            )}
          </CopyToClipboardHover>
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Type</h4>
        </div>
        <div className="col coa-details-info-right">
          <CopyToClipboardHover
            value={details.projectTypeName}
            id="projectTypeName"
          >
            {details.projectTypeName}
          </CopyToClipboardHover>
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Start Date</h4>
        </div>
        <div className="col coa-details-info-right">
          <CopyToClipboardHover
            value={details.projectStartDate}
            id="projectStartDate"
          >
            {details.projectStartDate}
          </CopyToClipboardHover>
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project End Date</h4>
        </div>
        <div className="col coa-details-info-right">
          <CopyToClipboardHover
            value={details.projectCompletionDate}
            id="projectCompletionDate"
          >
            {details.projectCompletionDate}
          </CopyToClipboardHover>
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Status</h4>
        </div>
        <div className="col coa-details-info-right">
          <CopyToClipboardHover
            value={details.projectStatus}
            id="projectStatus"
          >
            {details.projectStatus}
          </CopyToClipboardHover>
        </div>
      </div>
    </>
  );
};

export default PpmDetailsPage;
