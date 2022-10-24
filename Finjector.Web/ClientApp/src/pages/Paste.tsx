import React, { useEffect } from "react";
import CoaDisplay from "../components/CoaDisplay";
import SaveAndUseButton from "../components/SaveAndUseButton";
import { Chart, ChartType, ChartData } from "../types";
import {
  buildInitialGlSegments,
  buildInitialPpmSegments,
} from "../util/segmentHelpers";
import {
  fromGlSegmentString,
  fromPpmSegmentString,
} from "../util/segmentValidation";

const Paste = () => {
  const [coa, setCoa] = React.useState<string>("");

  // TODO: need to determine from string
  const chartType = true ? ChartType.PPM : ChartType.GL;

  // paste never starts with existing data, always start default
  const [savedChart, setSavedChart] = React.useState<Chart>({
    id: "",
    chartType,
    displayName: "",
    segmentString: "",
  });

  // in progress chart data
  const [chartData, setChartData] = React.useState<ChartData>({
    chartType,
    glSegments: buildInitialGlSegments(),
    ppmSegments: buildInitialPpmSegments(),
  });

  useEffect(() => {
    // whenever coa changes, update chartData
    // pass validity==true if there is a coa value, since we are pasting
    const valid = coa.length > 0;

    setChartData({
      chartType,
      glSegments:
        chartType === ChartType.GL
          ? fromGlSegmentString(coa, valid)
          : buildInitialGlSegments(),
      ppmSegments:
        chartType === ChartType.PPM
          ? fromPpmSegmentString(coa, valid)
          : buildInitialPpmSegments(),
    });
  }, [chartType, coa]);

  return (
    <div className="p-3">
      <h2>Paste in existing CoA</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="coa-input" className="form-label">
            Paste in a copied account number
          </label>
          <textarea
            className="form-control"
            id="coa-input"
            value={coa}
            onChange={(e) => setCoa(e.target.value)}
            placeholder="ex: 1311-63031-9300531-508210-44-G29-CM00000039-510139-0000-000000-000000"
          ></textarea>
        </div>
      </form>
      <CoaDisplay chartData={chartData} />
      <SaveAndUseButton chartData={chartData} />
    </div>
  );
};

export default Paste;
