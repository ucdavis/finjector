import React from "react";
import { renderNameAndEmail } from "../../util/util";
import { Approver } from "../../types";

interface PpmDetailsProps {
  ppmProjectManager: Approver;
}

const PpmDetails: React.FC<PpmDetailsProps> = ({ ppmProjectManager }) => {
  return (
    <>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Manager</h4>
        </div>
        <div className="col coa-details-info-right">
          {renderNameAndEmail(ppmProjectManager.name, ppmProjectManager.email)}
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Name</h4>
        </div>
        <div className="col coa-details-info-right"></div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Start Date</h4>
        </div>
        <div className="col coa-details-info-right"></div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project End Date</h4>
        </div>
        <div className="col coa-details-info-right"></div>
      </div>
    </>
  );
};

export default PpmDetails;
