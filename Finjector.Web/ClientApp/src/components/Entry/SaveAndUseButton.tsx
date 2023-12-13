import React from "react";
import { useNavigate } from "react-router-dom";

import { useSaveChart } from "../../queries/storedChartQueries";
import { Coa, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import FinjectorButton from "../Shared/FinjectorButton";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
}

const SaveAndUseButton = (props: Props) => {
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
          `/teams/${savedChart.folder?.teamId}/folders/${savedChart.folder?.id}/selected/${data.id}/${data.segmentString}`
        );
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
        Save and use
      </FinjectorButton>
    </div>
  );
};

export default SaveAndUseButton;
