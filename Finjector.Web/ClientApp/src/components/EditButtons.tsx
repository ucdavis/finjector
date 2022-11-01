import React from "react";
import { useNavigate } from "react-router-dom";

import { useRemoveChart, useSaveChart } from "../queries/storedChartQueries";
import { Chart, ChartData } from "../types";
import { toSegmentString } from "../util/segmentValidation";

const landingPage = "/landing";

interface Props {
  chartData: ChartData;
  savedChart: Chart;
}

// Handle remove, save, copy and use buttons
const EditButtons = (props: Props) => {
  const navigate = useNavigate();

  const saveMutation = useSaveChart();
  const removeMutation = useRemoveChart();

  const save = () => {
    const chartToSave: Chart = {
      ...props.savedChart,
      segmentString: toSegmentString(props.chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: () => {
        navigate(landingPage);
      },
    });
  };

  const copy = () => {
    // create a new chart based on the starting point of current chart
    const chartToSave: Chart = {
      ...props.savedChart,
      id: "",
      displayName: `${props.savedChart.displayName} (copy)`,
      segmentString: toSegmentString(props.chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: () => {
        navigate(landingPage);
      },
    });
  };

  const remove = () => {
    removeMutation.mutate(props.savedChart, {
      onSuccess: () => {
        navigate(landingPage);
      },
    });
  };

  const use = () => {
    navigate(
      `/selected/${props.savedChart.id}/${toSegmentString(props.chartData)}`
    );
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-danger"
        disabled={removeMutation.isLoading}
        onClick={remove}
      >
        Remove
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={saveMutation.isLoading || !props.savedChart.displayName}
        onClick={copy}
      >
        Copy
      </button>
      <button
        className="btn btn-primary"
        type="button"
        disabled={saveMutation.isLoading || !props.savedChart.displayName}
        onClick={save}
      >
        Save
      </button>
      <button className="btn btn-primary" type="button" onClick={use}>
        Use
      </button>
    </>
  );
};

export default EditButtons;
