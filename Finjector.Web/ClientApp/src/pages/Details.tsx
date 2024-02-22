import { useParams } from "react-router-dom";
import { AeDetails, ChartType, FinQueryStatus } from "../types";
import { useGetChartDetails } from "../queries/storedChartQueries";
import { ChartDebugInfo } from "../components/Shared/LoadingAndErrors/ChartDebugInfo";
import DetailsTitle from "../components/Details/DetailsTitle";
import DetailsTable from "../components/Details/DetailsTable";
import PageTitle from "../components/Shared/Layout/PageTitle";
import DetailsAeErrors from "../components/Details/DetailsAeErrors";
import PageBody from "../components/Shared/Layout/PageBody";
import DetailsChartString from "../components/Details/DetailsChartString";
import { useFinQueryStatus } from "../util/error";

const Details = () => {
  const { chartId, chartSegmentString } = useParams();
  const chartDetailsQuery = useGetChartDetails(
    chartSegmentString || "",
    chartId
  );

  const queryStatus: FinQueryStatus = useFinQueryStatus(chartDetailsQuery);

  const aeDetails: AeDetails | undefined = chartDetailsQuery.data?.aeDetails;

  const isPpmOrGlClassName =
    aeDetails?.chartType === ChartType.PPM
      ? "is-ppm"
      : aeDetails?.chartType === ChartType.GL
      ? "is-gl"
      : queryStatus.isError
      ? "is-error"
      : "is-none";

  return (
    <div className="main">
      <PageTitle isRow={true}>
        <DetailsTitle
          aeDetails={aeDetails}
          chartStringDetails={chartDetailsQuery.data?.chartStringDetails}
          queryStatus={queryStatus}
        />
      </PageTitle>
      <PageBody>
        <DetailsAeErrors
          errors={aeDetails?.errors}
          warnings={aeDetails?.warnings}
        />
        <div className={`chartstring-details ${isPpmOrGlClassName}`}>
          <DetailsChartString
            chartString={aeDetails?.chartString ?? chartSegmentString}
            chartType={aeDetails?.chartType}
            queryStatus={queryStatus}
          />
          <DetailsTable
            aeDetails={aeDetails}
            chartSegmentString={chartSegmentString}
            queryStatus={queryStatus}
          />
        </div>
      </PageBody>
      <ChartDebugInfo chartDetails={chartDetailsQuery.data} />
    </div>
  );
};

export default Details;
