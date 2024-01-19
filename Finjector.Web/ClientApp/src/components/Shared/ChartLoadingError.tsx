import React from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useRemoveChart } from "../../queries/storedChartQueries";
import { Coa } from "../../types";
import FinjectorButton from "./FinjectorButton";
import {
  isGlSegmentString,
  isPpmSegmentString,
} from "../../util/segmentValidation";

export const ChartLoadingError = () => {
  const navigate = useNavigate();
  const { chartId, chartSegmentString } = useParams();

  // get chartId as a number
  const chartIdAsNumber = parseInt(chartId || "");

  const isChartIdValid = !isNaN(chartIdAsNumber) && chartIdAsNumber > 0;

  const removeMutation = useRemoveChart();

  const remove = () => {
    if (chartIdAsNumber > 0) {
      removeMutation.mutate({ id: chartIdAsNumber } as Coa, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  const errorReason = React.useMemo(() => {
    if (chartSegmentString) {
      // validate the chart string format
      if (
        isPpmSegmentString(chartSegmentString) ||
        isGlSegmentString(chartSegmentString)
      ) {
        return "The chart string format is valid but we are not able to load it at the moment. Please try again later.";
      } else {
        return "The chart string format is not valid. Ensure you have a valid GL or PPM chart string and try again.";
      }
    }
  }, [chartSegmentString]);

  return (
    <div className="p-2">
      <h1>Error loading chart</h1>
      <p>{errorReason}</p>
      {
        // if we have a chartId, we can remove it
        isChartIdValid && (
          <div>
            <p>
              If you'd like to permanently remove this entry, click the button
              below.
            </p>
            <FinjectorButton
              color="danger"
              disabled={removeMutation.isLoading}
              onClick={remove}
            >
              Remove
            </FinjectorButton>
          </div>
        )
      }
    </div>
  );
};
