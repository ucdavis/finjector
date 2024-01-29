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

const Details = () => {
  const { chartId, chartSegmentString } = useParams();
  const chartDetailsQuery = useGetChartDetails(
    chartSegmentString || "",
    chartId
  );
  const queryStatus: FinQueryStatus = { ...chartDetailsQuery };

  const aeDetails: AeDetails | undefined = chartDetailsQuery.data?.aeDetails;

  const isPpmOrGlClassName =
    aeDetails?.chartType === ChartType.PPM
      ? "is-ppm"
      : aeDetails?.chartType === ChartType.GL
      ? "is-gl"
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
          hasWarnings={aeDetails?.hasWarnings}
          warnings={aeDetails?.warnings}
        />
        <div className={`chartstring-details ${isPpmOrGlClassName}`}>
          <DetailsChartString
            chartString={aeDetails?.chartString}
            chartType={aeDetails?.chartType}
            hasWarnings={aeDetails?.hasWarnings}
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
