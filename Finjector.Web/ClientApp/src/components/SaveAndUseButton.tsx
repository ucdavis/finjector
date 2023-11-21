import React from "react";
import { useNavigate } from "react-router-dom";

import { useSaveChart } from "../queries/storedChartQueries";
import { Coa, ChartData } from "../types";
import { toSegmentString } from "../util/segmentValidation";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
}

const SaveAndUseButton = (props: Props) => {
  const navigate = useNavigate();

  const saveMutation = useSaveChart();

  const saveAndUse = () => {
    const chartToSave: Coa = {
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
      <button
        className="btn btn-primary"
        type="button"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={saveAndUse}
      >
        Save and use
      </button>
    </div>
  );
};

export default SaveAndUseButton;
