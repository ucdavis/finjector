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
      {details.roles &&
        details.roles
          .filter((role) => role.type === "P")
          .map((role, i) => {
            return (
              <div key={i}>
                <DetailsRow
                  headerColText={
                    role.roleName.startsWith("Project")
                      ? role.roleName
                      : `Project ${role.roleName}`
                  }
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
      {details.awardCloseDate && (
        <DetailsRow
          headerColText="Award Close Date"
          column2={
            <CopyToClipboardHover
              value={details.awardCloseDate}
              id="awardCloseDate"
            >
              {details.awardCloseDate}
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
      {details.roles &&
        details.roles
          .filter((role) => role.type === "A")
          .map((role, i) => {
            return (
              <div key={i}>
                <DetailsRow
                  headerColText={`Award ${role.roleName}`}
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
      {details.awardInfo && (
        <DetailsRow
          headerColText="SPONSOR AWARD NUMBER"
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
    </>
  );
};

export default PpmDetailsPage;
