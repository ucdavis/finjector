import React from "react";

import { ChartData } from "../types";

interface Props {
  chartData: ChartData;
}

const SaveAndUseButton = (props: Props) => {
  const { chartType, glSegments, ppmSegments } = props.chartData;

  const saveAndUse = () => {
    // TODO: how do we get name to save with?
    // TODO: should we validate before saving? if not, when?
    // TODO: should we check to make sure it's not already saved?
  };

  return (
    <button className="btn btn-primary" type="button" onClick={saveAndUse}>
      Save and use
    </button>
  );
};

export default SaveAndUseButton;