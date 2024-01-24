import { useParams } from "react-router-dom";
import { AeDetails, ChartType } from "../types";
import { useGetChartDetails } from "../queries/storedChartQueries";
import { ChartDebugInfo } from "../components/Shared/LoadingAndErrors/ChartDebugInfo";
import DetailsTitle from "../components/Details/DetailsTitle";
import DetailsBody from "../components/Details/DetailsBody";
import PageTitle from "../components/Shared/Layout/PageTitle";
import DetailsPageBody from "../components/Shared/Layout/DetailsPageBody";

const Details = () => {
  const { chartId, chartSegmentString } = useParams();
  const chartDetailsQuery = useGetChartDetails(
    chartSegmentString || "",
    chartId
  );

  const aeDetails: AeDetails | undefined = chartDetailsQuery.data?.aeDetails;

  const invalid =
    (chartDetailsQuery.isLoading && chartDetailsQuery.isFetching) || // if we're doing first fetch
    chartDetailsQuery.isError || // if we've errored
    !aeDetails?.chartString || // if we have no data
    aeDetails.chartType === ChartType.INVALID; // if we have invalid data

  return (
    <div className="main">
      <PageTitle isRow={true}>
        <DetailsTitle
          aeDetails={aeDetails}
          chartStringDetails={chartDetailsQuery.data?.chartStringDetails}
          invalid={invalid}
          isLoading={chartDetailsQuery.isLoading}
          isFetching={chartDetailsQuery.isFetching}
          isError={chartDetailsQuery.isError}
        />
      </PageTitle>
      <DetailsPageBody>
        <DetailsBody
          aeDetails={aeDetails}
          chartSegmentString={chartSegmentString}
          invalid={invalid}
          isLoading={chartDetailsQuery.isLoading}
          isFetching={chartDetailsQuery.isFetching}
          isError={chartDetailsQuery.isError}
        />
      </DetailsPageBody>
      <ChartDebugInfo chartDetails={chartDetailsQuery.data} />
    </div>
  );
};

export default Details;
