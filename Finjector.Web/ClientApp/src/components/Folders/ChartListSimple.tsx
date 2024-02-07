import { Coa, FinQueryStatus, Folder } from "../../types";
import ChartListItem from "../Shared/ChartListItem";
import { useFinQueryStatusHandler } from "../../util/error";
import { FinError } from "../Shared/LoadingAndErrors/FinError";
import FinEmpty from "../Shared/LoadingAndErrors/FinEmpty";
import FinFunError from "../Shared/LoadingAndErrors/FinFunError";

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

  // if the query did not throw any errors but somehow didn't return a folder (this shouldn't happen?)
  if (!folder) return <FinFunError />;
  // if we have successfully loaded the folder but there are no charts (not an error)
  if (!charts || charts.length === 0)
    return <FinEmpty title="There are no charts in this folder." />;

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
