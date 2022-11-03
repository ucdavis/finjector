import { ChartData, ChartType } from "../types";

interface Props {
  chartData: ChartData;
}

export const ChartDebugInfo = (props: Props) => {
  const { chartData } = props;

  // only show in debug mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <pre>
      {JSON.stringify(
        chartData.chartType === ChartType.PPM
          ? chartData.ppmSegments
          : chartData.glSegments,
        null,
        2
      )}
    </pre>
  );
};
