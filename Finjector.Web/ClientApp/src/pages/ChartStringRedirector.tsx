import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useGetChart } from "../queries/storedChartQueries";
import FinLoader from "../components/Shared/LoadingAndErrors/FinLoader";

const ChartStringRedirector: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();

  const chartQuery = useGetChart(id || "");

  if (id === "") {
    return <Navigate to="/" />;
  }

  if (chartQuery.isLoading) {
    return <FinLoader />;
  }

  return (
    <Navigate
      to={`/${type}/${chartQuery.data?.id}/${chartQuery.data?.segmentString}`}
    />
  );
};

export default ChartStringRedirector;
