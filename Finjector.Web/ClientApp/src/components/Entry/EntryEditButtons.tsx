import React from "react";
import { useNavigate } from "react-router-dom";

import { useRemoveChart, useSaveChart } from "../../queries/storedChartQueries";
import { Coa, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import FinjectorButton from "../Shared/FinjectorButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faBolt,
  faBookmark,
  faClone,
} from "@fortawesome/free-solid-svg-icons";

const landingPage = "/landing";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
}

// Handle remove, save, copy and use buttons
const EntryEditButtons = (props: Props) => {
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
      folderId: props.savedChart.folderId || 0,
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
        className="flex-fill"
        disabled={removeMutation.isLoading}
        onClick={remove}
      >
        <FontAwesomeIcon icon={faTrash} />
        Remove
      </FinjectorButton>
      <FinjectorButton
        className="flex-fill"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={copy}
      >
        <FontAwesomeIcon icon={faClone} />
        Duplicate
      </FinjectorButton>
      <FinjectorButton
        className="flex-fill"
        disabled={saveMutation.isLoading || !props.savedChart.name}
        onClick={save}
      >
        <FontAwesomeIcon icon={faBookmark} />
        Save
      </FinjectorButton>
      <FinjectorButton className="flex-fill" onClick={use}>
        <FontAwesomeIcon icon={faBolt} />
        Use
      </FinjectorButton>
    </div>
  );
};

export default EntryEditButtons;
