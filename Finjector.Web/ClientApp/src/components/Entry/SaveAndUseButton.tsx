import React from "react";
import { useNavigate } from "react-router-dom";

import { useSaveChart } from "../../queries/storedChartQueries";
import { Coa, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import FinjectorButton from "../Shared/FinjectorButton";
import usePopupStatus from "../../util/customHooks";
import { toast } from "react-toastify";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
}

const SaveAndUseButton = (props: Props) => {
  const isInPopup = usePopupStatus();
  const navigate = useNavigate();

  const { chartData, savedChart } = props;

  const saveMutation = useSaveChart();

  const saveAndUse = () => {
    const chartToSave: Coa = {
      ...props.savedChart,
      chartType: props.chartData.chartType,
      segmentString: toSegmentString(chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folder?.id}/${
            isInPopup ? "selected" : "details"
          }/${data.id}/${data.segmentString}`
        );
      },
      onError: (error) => {
        toast.error("Error saving chart.");
      },
    });
  };

  return (
    <div className="d-flex">
      <FinjectorButton
        className="flex-fill"
        disabled={saveMutation.isLoading || !savedChart.name}
        onClick={saveAndUse}
        margin={false}
      >
        {isInPopup ? "Save and use" : "Save"}
      </FinjectorButton>
    </div>
  );
};

export default SaveAndUseButton;
