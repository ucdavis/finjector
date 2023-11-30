import React from "react";

import { useSegmentValidateQuery } from "../../queries/segmentQueries";
import { ChartData } from "../../types";
import { chartDataValid, toSegmentString } from "../../util/segmentValidation";

interface Props {
  chartData: ChartData;
}

const CoaDisplay = (props: Props) => {
  const chartString = toSegmentString(props.chartData);

  const chartStructureValid = chartDataValid(props.chartData);

  const segmentValidate = useSegmentValidateQuery(
    props.chartData.chartType,
    chartString,
    chartStructureValid
  );

  const getValidateMessage = () => {
    let alertType = "info";
    let message = "";

    if (!chartStructureValid) {
      // chart not even valid so we won't go to server to look it up, show generic message
      message = "Chart is not yet valid";
    } else if (segmentValidate.isLoading) {
      message = "Validating...";
    } else if (segmentValidate.isError) {
      message = "Error validating chart";
      alertType = "danger";
    } else if (
      segmentValidate.data &&
      segmentValidate.data.validationResponse.valid === false
    ) {
      message = segmentValidate.data.validationResponse.errorMessages[0]; // show the first error message
      alertType = "danger";
    } else if (
      segmentValidate.data &&
      segmentValidate.data.validationResponse.valid
    ) {
      message = "Chart is valid";
      alertType = "success";
    }

    return (
      <div className={`alert alert-${alertType}`} role="alert">
        {message}
      </div>
    );
  };

  return (
    <div className="pt-2">
      {getValidateMessage()}
      <div className="text-center">
        <p>
          {chartString}
          {segmentValidate.data?.segments.award && (
            <div>
              <label className="form-label text-uppercase">Award:</label>{" "}
              {segmentValidate.data?.segments.award}
            </div>
          )}
          {segmentValidate.data?.segments.fundingSource && (
            <div>
              <label className="form-label text-uppercase">
                Funding Source:
              </label>{" "}
              {segmentValidate.data?.segments.fundingSource}
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default CoaDisplay;
