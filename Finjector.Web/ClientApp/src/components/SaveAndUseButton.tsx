import React from "react";
import { useNavigate } from "react-router-dom";

import { useSaveChart } from "../queries/storedChartQueries";
import { Chart, ChartData } from "../types";
import { toSegmentString } from "../util/segmentValidation";

interface Props {
  chartData: ChartData;
}

const SaveAndUseButton = (props: Props) => {
  const navigate = useNavigate();

  const saveMutation = useSaveChart();

  const saveAndUse = () => {
    // TODO: how do we get name to save with?
    // TODO: should we validate before saving? if not, when?
    // TODO: should we check to make sure it's not already saved?

    const chartToSave: Chart = {
      id: "",
      chartType: props.chartData.chartType,
      displayName: "TODO: Saved Chart",
      segmentString: toSegmentString(props.chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        console.log("saved chart", data);

        navigate(`/selected/${data.segmentString}`);
      },
    });
  };

  return (
    <button
      className="btn btn-primary"
      type="button"
      disabled={saveMutation.isLoading}
      onClick={saveAndUse}
    >
      Save and use
    </button>
  );
};

export default SaveAndUseButton;
