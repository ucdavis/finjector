import React from "react";
import { renderNameAndEmail } from "../../util/util";
import { PpmDetails } from "../../types";

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
          {renderNameAndEmail(
            details.ppmProjectManager.name,
            details.ppmProjectManager.email
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Type</h4>
        </div>
        <div className="col coa-details-info-right">
          {details.projectTypeName}
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Start Date</h4>
        </div>
        <div className="col coa-details-info-right">
          {details.projectStartDate}
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project End Date</h4>
        </div>
        <div className="col coa-details-info-right">
          {details.projectCompletionDate}
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Status</h4>
        </div>
        <div className="col coa-details-info-right">
          {details.projectStatus}
        </div>
      </div>
    </>
  );
};

export default PpmDetailsPage;
