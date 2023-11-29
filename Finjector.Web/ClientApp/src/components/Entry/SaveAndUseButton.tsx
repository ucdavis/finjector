import React from "react";
import { useNavigate } from "react-router-dom";

import { useSaveChart } from "../../queries/storedChartQueries";
import { Chart, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import FinjectorButton from "../Shared/FinjectorButton";

interface Props {
  chartData: ChartData;
  savedChart: Chart;
}

const SaveAndUseButton = (props: Props) => {
  const navigate = useNavigate();

  const saveMutation = useSaveChart();

  const saveAndUse = () => {
    const chartToSave: Chart = {
      ...props.savedChart,
      chartType: props.chartData.chartType,
      segmentString: toSegmentString(props.chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        navigate(`/selected/${data.id}/${data.segmentString}`);
      },
    });
  };

  return (
    <div className="d-grid">
      <FinjectorButton
        className="btn btn-primary"
        type="button"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={saveAndUse}
      >
        Save and use
      </FinjectorButton>
    </div>
  );
};

export default SaveAndUseButton;
