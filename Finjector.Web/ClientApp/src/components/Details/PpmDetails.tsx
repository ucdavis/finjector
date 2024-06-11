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
      {details.projectDescription && (
        <DetailsRow
          headerColText="Project Description"
          column2={
            <CopyToClipboardHover
              value={details.projectDescription}
              id="projectDescription"
            >
              {details.projectDescription}
            </CopyToClipboardHover>
          }
        />
      )}
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
      {details.awardStartDate && (
        <DetailsRow
          headerColText="Award Start Date"
          column2={
            <CopyToClipboardHover
              value={details.awardStartDate}
              id="awardStartDate"
            >
              {details.awardStartDate}
            </CopyToClipboardHover>
          }
        />
      )}
      {details.awardEndDate && (
        <DetailsRow
          headerColText="Award End Date"
          column2={
            <CopyToClipboardHover
              value={details.awardEndDate}
              id="awardEndDate"
            >
              {details.awardEndDate}
            </CopyToClipboardHover>
          }
        />
      )}
      {details.awardStatus && (
        <DetailsRow
          headerColText="Award Status"
          column2={
            <CopyToClipboardHover value={details.awardStatus} id="awardStatus">
              {details.awardStatus}
            </CopyToClipboardHover>
          }
        />
      )}
      {details.awardInfo && (
        <DetailsRow
          headerColText="Award Info"
          column2={
            <CopyToClipboardHover value={details.awardInfo} id="awardInfo">
              {details.awardInfo}
            </CopyToClipboardHover>
          }
        />
      )}
      <DetailsRow
        headerColText="POETAF String"
        column2={
          <CopyToClipboardHover value={details.poetString} id="poetString">
            {details.poetString}
          </CopyToClipboardHover>
        }
      />
      {details.glRevenueTransferString && (
        <DetailsRow
          headerColText="GL Revenue Transfer String"
          column2={
            <CopyToClipboardHover
              value={details.glRevenueTransferString}
              id="glRevenueTransferString"
            >
              {details.glRevenueTransferString}
            </CopyToClipboardHover>
          }
        />
      )}
      {details.roles &&
        details.roles.map((role, i) => {
          return (
            <div key={i}>
              <DetailsRow
                headerColText={role.roleName}
                column2={role.approvers.map((approver, j) => {
                  return (
                    <div key={j}>
                      <CopyToClipboardHover
                        value={approver.email ?? ""}
                        id={`approver-${i}-${j}`}
                      >
                        {renderNameAndEmail(approver.name, approver.email)}
                      </CopyToClipboardHover>
                    </div>
                  );
                })}
              />
            </div>
          );
        })}
    </>
  );
};

export default PpmDetailsPage;
