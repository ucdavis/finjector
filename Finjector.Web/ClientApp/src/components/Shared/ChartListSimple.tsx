import FinLoader from "./FinLoader";
import { Coa, Folder } from "../../types";
import ChartListItem from "./ChartListItem";

interface Props {
  charts: Coa[] | undefined;
  folder: Folder;
  filter: string;
}

const ChartListSimple = (props: Props) => {
  const { charts, folder } = props;

  if (!charts) {
    return <FinLoader />;
  }

  const filterLowercase = props.filter.toLowerCase();

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
