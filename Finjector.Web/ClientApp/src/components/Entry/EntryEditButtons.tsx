import React from "react";
import { useNavigate } from "react-router-dom";
import usePopupStatus from "../../util/customHooks";
import { useRemoveChart, useSaveChart } from "../../queries/storedChartQueries";
import { Coa, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import FinButton from "../Shared/FinButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faBolt,
  faBookmark,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const landingPage = "/landing";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
}

// Handle remove, save, copy and use buttons
const EntryEditButtons = (props: Props) => {
  const navigate = useNavigate();
  const isInPopup = usePopupStatus();

  const { chartData, savedChart } = props;

  const saveMutation = useSaveChart();
  const removeMutation = useRemoveChart();

  const save = () => {
    const chartToSave: Coa = {
      ...savedChart,
      segmentString: toSegmentString(chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folderId}/details/${data.id}/${chartToSave.segmentString}`
        );
      },
      onError: (error) => {
        toast.error("Error saving chart.");
      },
    });
  };

  const copy = () => {
    // create a new chart based on the starting point of current chart
    const chartToSave: Coa = {
      ...savedChart,
      folderId: savedChart.folderId || 0,
      id: 0,
      name: `${props.savedChart.name}`,
      segmentString: toSegmentString(props.chartData),
    };

    //teams/1/folders/1/details/1/3110-13U20-ADNO003-238533-00-000-0000000000-000000-0000-000000-000000
    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folderId}/details/${data.id}/${chartToSave.segmentString}`
        );
      },
      onError: (error) => {
        toast.error("Error copying chart.");
      },
    });
  };

  const remove = () => {
    removeMutation.mutate(props.savedChart, {
      onSuccess: () => {
        navigate(landingPage);
      },
      onError: (error) => {
        toast.error("Error removing chart.");
      },
    });
  };

  const use = () => {
    navigate(
      `/teams/${savedChart.folder?.teamId}/folders/${
        savedChart.folder?.id
      }/selected/${savedChart.id}/${toSegmentString(props.chartData)}`
    );
  };

  return (
    <div className="d-flex justify-content-between">
      {savedChart.canEdit && (
        <FinButton
          className="flex-fill"
          disabled={removeMutation.isLoading}
          onClick={remove}
          margin={false}
        >
          <FontAwesomeIcon icon={faTrash} />
          Remove
        </FinButton>
      )}
      <FinButton
        className="flex-fill"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={copy}
      >
        <FontAwesomeIcon icon={faClone} />
        Duplicate
      </FinButton>
      {savedChart.canEdit && (
        <FinButton
          className="flex-fill"
          disabled={saveMutation.isLoading || !props.savedChart.name}
          onClick={save}
        >
          <FontAwesomeIcon icon={faBookmark} />
          Save
        </FinButton>
      )}
      {isInPopup && (
        <FinButton className="flex-fill" onClick={use}>
          <FontAwesomeIcon icon={faBolt} />
          Use
        </FinButton>
      )}
    </div>
  );
};

export default EntryEditButtons;
