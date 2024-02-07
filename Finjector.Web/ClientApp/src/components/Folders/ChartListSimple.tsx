import { Coa, FinQueryStatus, Folder } from "../../types";
import ChartListItem from "../Shared/ChartListItem";
import { useFinQueryStatusHandler } from "../../util/error";
import { FinError } from "../Shared/LoadingAndErrors/FinError";

interface Props {
  charts: Coa[] | undefined;
  folder: Folder | undefined;
  filter: string;
  queryStatus: FinQueryStatus;
}

const ChartListSimple: React.FC<Props> = ({
  charts,
  folder,
  filter,
  queryStatus,
}) => {
  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });

  if (queryStatusComponent) return <>{queryStatusComponent}</>;

  if (!folder) return <FinError title="No Folder Found" />;
  if (!charts) return <FinError title="No Charts Found" />;

  const filterLowercase = filter.toLowerCase();

  const filteredCharts = charts.filter((chart) => {
    return (
      chart.name.toLowerCase().includes(filterLowercase) ||
      chart.segmentString.toLowerCase().includes(filterLowercase)
    );
  });

  return (
    <ul className="list-group">
      {filteredCharts.map((chart) => (
        <ChartListItem folder={folder} key={chart.id} chart={chart} />
      ))}
    </ul>
  );
};

export default ChartListSimple;
