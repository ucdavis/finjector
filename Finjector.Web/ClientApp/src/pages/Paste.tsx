import React, { useEffect } from "react";
import CoaDisplay from "../components/CoaDisplay";
import NameEntry from "../components/NameEntry";
import SaveAndUseButton from "../components/SaveAndUseButton";
import { Chart, ChartType, ChartData } from "../types";
import {
  buildInitialGlSegments,
  buildInitialPpmSegments,
} from "../util/segmentHelpers";
import {
  fromGlSegmentString,
  fromPpmSegmentString,
  isGlSegmentString,
} from "../util/segmentValidation";

import { HomeLink } from "../components/HomeLink";

import { ChartDebugInfo } from "../components/ChartDebugInfo";

const Paste = () => {
  const [coa, setCoa] = React.useState<string>("");

  // TODO: need to determine from string
  const chartType = isGlSegmentString(coa) ? ChartType.GL : ChartType.PPM;

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

    setSavedChart((saved) => ({ ...saved, chartType, segmentString: coa }));
  }, [chartType, coa]);

  return (
    <div className="main">
      <HomeLink>Back</HomeLink>
      <h2>Paste in existing CoA</h2>
      <form>
        <div className="mb-3">
          <p>Paste in a copied account number</p>
          <textarea
            className="form-control"
            id="coa-input"
            value={coa}
            onChange={(e) => setCoa(e.target.value)}
            placeholder="ex: 1311-63031-9300531-508210-44-G29-CM00000039-510139-0000-000000-000000"
          ></textarea>
        </div>
      </form>
      <h2>CoA Name</h2>
      <NameEntry
        chart={savedChart}
        updateDisplayName={(n) =>
          setSavedChart((c) => ({ ...c, displayName: n }))
        }
      />
      <CoaDisplay chartData={chartData} />
      <SaveAndUseButton chartData={chartData} savedChart={savedChart} />
      <ChartDebugInfo chartData={chartData} />
    </div>
  );
};

export default Paste;
