import { ChartData, ChartStringAndAeDetails, ChartType } from "../../types";

interface Props {
  chartData?: ChartData;
  chartDetails?: ChartStringAndAeDetails;
}

export const ChartDebugInfo = (props: Props) => {
  const { chartData, chartDetails } = props;

  // only show in debug mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!!chartData) {
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
  }

  if (!!chartDetails) {
    return <pre>{JSON.stringify(chartDetails, null, 2)}</pre>;
  }

  return null;
};
