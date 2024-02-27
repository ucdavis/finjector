import React from "react";
import { AeDetails, ChartStringEditModel, FinQueryStatus } from "../../types";
import { faBolt, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import FinButton from "../Shared/FinButton";
import SharePopup from "./SharePopup";
import { useParams, useNavigate } from "react-router-dom";
import usePopupStatus from "../../util/customHooks";

interface DetailsHeaderProps {
  aeDetails: AeDetails | undefined;
  chartStringDetails: ChartStringEditModel | undefined;
  queryStatus: FinQueryStatus;
}

const DetailsTitle: React.FC<DetailsHeaderProps> = ({
  aeDetails,
  chartStringDetails,
  queryStatus: { isLoading, isError },
}) => {
  const { chartId, teamId, folderId } = useParams();

  const isInPopup = usePopupStatus();
  const navigate = useNavigate();

  const use = () => {
    if (chartId) {
      navigate(
        `/teams/${teamId}/folders/${folderId}/selected/${chartId}/${aeDetails?.chartString}`
      );
    } else {
      navigate(`/selected/${aeDetails?.chartString}`);
    }
  };

  const getEditLinkUrl = () => {
    if (chartId) {
      return `/teams/${teamId}/folders/${folderId}/entry/${chartId}/${aeDetails?.chartString}`;
    } else {
      return `/entry/${aeDetails?.chartString}`;
    }
  };

  if (isLoading) {
    return (
      <div className="col-12 col-md-7">
        <h4>Team / Folder</h4>
        <h1>Scribbling in details...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="col-12 col-md-7">
        <h4>Team / Folder</h4>
        <h1>Chart String Details</h1>
      </div>
    );
  }

  const chartStringName = chartStringDetails?.name ?? "Chart String Details";
  return (
    <>
      <div className="col-12 col-md-7">
        {chartStringDetails && (
          <h4>
            {chartStringDetails.teamName} {"/ "}
            {chartStringDetails.folder?.name}
          </h4>
        )}
        <CopyToClipboardHover value={chartStringName} id="ChartName">
          <h1>{chartStringName}</h1>
        </CopyToClipboardHover>
      </div>
      <div className="col-12 col-md-5 text-end">
        {isInPopup && (
          <FinButton onClick={use}>
            <FontAwesomeIcon icon={faBolt} />
            Use
          </FinButton>
        )}
        <FinButton to={getEditLinkUrl()}>
          <FontAwesomeIcon icon={faPencil} />
          Edit Chart String
        </FinButton>
        <SharePopup
          chartString={aeDetails?.chartString ?? ""}
          segmentDetails={aeDetails?.segmentDetails ?? []}
        />
      </div>
    </>
  );
};

export default DetailsTitle;
