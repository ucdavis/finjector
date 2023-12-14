import React from "react";
import { useNavigate } from "react-router-dom";

import { useSaveChart } from "../../queries/storedChartQueries";
import { Coa, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import FinjectorButton from "../Shared/FinjectorButton";
import usePopupStatus from "../../util/customHooks";

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
        if (isInPopup) {
          navigate(
            `/teams/${data.folder?.teamId}/folders/${data.folder?.id}/selected/${data.id}/${data.segmentString}`
          );
        } else {
          navigate(
            `/teams/${data.folder?.teamId}/folders/${data.folder?.id}/details/${data.id}/${data.segmentString}`
          );
        }
      },
    });
  };

  return (
    <div className="d-grid">
      <FinjectorButton
        className="btn btn-primary"
        type="button"
        disabled={saveMutation.isLoading || !savedChart.name}
        onClick={saveAndUse}
      >
        {isInPopup ? "Save and use" : "Save"}
      </FinjectorButton>
    </div>
  );
};

export default SaveAndUseButton;
