import React from "react";
import { useNavigate } from "react-router-dom";

import { useRemoveChart, useSaveChart } from "../../queries/storedChartQueries";
import { Chart, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import FinjectorButton from "../Shared/FinjectorButton";

const landingPage = "/landing";

interface Props {
  chartData: ChartData;
  savedChart: Chart;
}

// Handle remove, save, copy and use buttons
const EntryEditButtons = (props: Props) => {
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
      <FinjectorButton
        color="danger"
        className="flex-fill"
        disabled={removeMutation.isLoading}
        onClick={remove}
        colorFill={true}
      >
        Remove
      </FinjectorButton>
      <FinjectorButton
        color="secondary"
        className="flex-fill"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={copy}
        colorFill={true}
      >
        Duplicate
      </FinjectorButton>
      <FinjectorButton
        color="secondary"
        className="flex-fill"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={save}
        colorFill={true}
      >
        Save
      </FinjectorButton>
      <FinjectorButton
        color="primary"
        className="flex-fill"
        onClick={use}
        colorFill={true}
      >
        Use
      </FinjectorButton>
    </div>
  );
};

export default EntryEditButtons;
