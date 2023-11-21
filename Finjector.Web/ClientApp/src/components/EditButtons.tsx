import React from "react";
import { useNavigate } from "react-router-dom";

import { useRemoveChart, useSaveChart } from "../queries/storedChartQueries";
import { Coa, ChartData } from "../types";
import { toSegmentString } from "../util/segmentValidation";

const landingPage = "/landing";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
}

// Handle remove, save, copy and use buttons
const EditButtons = (props: Props) => {
  const navigate = useNavigate();

  const saveMutation = useSaveChart();
  const removeMutation = useRemoveChart();

  const save = () => {
    const chartToSave: Coa = {
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
    const chartToSave: Coa = {
      ...props.savedChart,
      id: 0,
      name: `${props.savedChart.name} (copy)`,
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
    <div className="d-flex p-2">
      <button
        type="button"
        className="btn btn-danger flex-fill me-3"
        disabled={removeMutation.isLoading}
        onClick={remove}
      >
        Remove
      </button>
      <button
        type="button"
        className="btn btn-secondary flex-fill me-3"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={copy}
      >
        Duplicate
      </button>
      <button
        className="btn btn-secondary flex-fill me-3"
        type="button"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={save}
      >
        Save
      </button>
      <button className="btn btn-primary flex-fill" type="button" onClick={use}>
        Use
      </button>
    </div>
  );
};

export default EditButtons;
