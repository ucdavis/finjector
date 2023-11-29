import React from "react";
import { renderNameAndEmail } from "../../util/util";
import { Approver } from "../../types";

interface PpmDetailsProps {
  ppmProjectManager: Approver;
  projectCompletionDate: string;
  projectStartDate: string;
  projectStatus: string;
  projectTypeName: string;
  ppmGlString: string;
}

const PpmDetails: React.FC<PpmDetailsProps> = ({
  ppmProjectManager,
  projectCompletionDate,
  projectStartDate,
  projectStatus,
  projectTypeName,
  ppmGlString,
}) => {
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
          <h4>Project Type</h4>
        </div>
        <div className="col coa-details-info-right">{projectTypeName}</div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Start Date</h4>
        </div>
        <div className="col coa-details-info-right">{projectStartDate}</div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project End Date</h4>
        </div>
        <div className="col coa-details-info-right">
          {projectCompletionDate}
        </div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>Project Status</h4>
        </div>
        <div className="col coa-details-info-right">{projectStatus}</div>
      </div>
      <div className="row">
        <div className="col-3 coa-info-title">
          <h4>GL Posting String</h4>
        </div>
        <div className="col coa-details-info-right">{ppmGlString}</div>
      </div>
    </>
  );
};

export default PpmDetails;
