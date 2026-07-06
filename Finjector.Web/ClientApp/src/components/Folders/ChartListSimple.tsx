import React from "react";
import { Coa, FinQueryStatus, Folder } from "../../types";
import ChartListItem from "../Shared/ChartListItem";
import { useFinQueryStatusHandler } from "../../util/error";
import FinEmpty from "../Shared/LoadingAndErrors/FinEmpty";
import FinFunError from "../Shared/LoadingAndErrors/FinFunError";
import usePopupStatus from "../../util/customHooks";

interface Props {
  charts: Coa[] | undefined;
  folder: Folder | undefined;
  filter: string;
  queryStatus: FinQueryStatus;
  selectedChartIds: number[];
  onChartSelectionChange: (chartId: number, selected: boolean) => void;
  onSelectAllVisibleCharts: (chartIds: number[]) => void;
  onUnselectVisibleCharts: (chartIds: number[]) => void;
}

const ChartListSimple: React.FC<Props> = ({
  charts,
  folder,
  filter,
  queryStatus,
  selectedChartIds,
  onChartSelectionChange,
  onSelectAllVisibleCharts,
  onUnselectVisibleCharts,
}) => {
  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });
  const isInPopup = usePopupStatus();
  const selectVisibleCheckboxRef = React.useRef<HTMLInputElement>(null);
  const filterLowercase = filter.toLowerCase();

  const filteredCharts = (charts ?? []).filter((chart) => {
    return (
      chart.name.toLowerCase().includes(filterLowercase) ||
      chart.segmentString.toLowerCase().includes(filterLowercase)
    );
  });

  const canSelectChartStrings =
    folder !== undefined &&
    (folder.teamIsPersonal === true ||
      folder.myFolderPermissions.some((p) => p === "Admin" || p === "Edit") ||
      folder.myTeamPermissions.some((p) => p === "Admin" || p === "Edit"));

  const visibleChartIds = filteredCharts.map((chart) => chart.id);
  const selectedVisibleChartCount = visibleChartIds.filter((chartId) =>
    selectedChartIds.includes(chartId),
  ).length;
  const allVisibleChartsSelected =
    visibleChartIds.length > 0 &&
    selectedVisibleChartCount === visibleChartIds.length;

  if (queryStatusComponent) return <>{queryStatusComponent}</>;

  // if the query did not throw any errors but still returned null/undefined
  // i can't think of why this would happen, but it makes the type checker happy. :)
  if (folder === undefined) return <FinFunError />;
  // if we have successfully loaded the folder but there are no charts (not an error)
  if (!charts || charts.length === 0)
    return <FinEmpty title="There are no charts in this folder." />;

  const toggleVisibleChartSelection = () => {
    if (allVisibleChartsSelected) {
      onUnselectVisibleCharts(visibleChartIds);
      return;
    }

    onSelectAllVisibleCharts(visibleChartIds);
  };

  return (
    <div
      className={`chartstring-list${isInPopup ? " is-in-popup" : ""}${
        canSelectChartStrings ? " has-selection" : ""
      }`}
    >
      {canSelectChartStrings && (
        <div className="chartstring-selection-toggle">
          <input
            ref={selectVisibleCheckboxRef}
            type="checkbox"
            aria-label="Select visible chart strings"
            checked={allVisibleChartsSelected}
            disabled={visibleChartIds.length === 0}
            onChange={toggleVisibleChartSelection}
          />
        </div>
      )}
      <ul className="list-group">
        {filteredCharts.map((chart) => (
          <ChartListItem
            folder={folder}
            key={chart.id}
            chart={chart}
            showMultiSelect={canSelectChartStrings}
            isSelected={selectedChartIds.includes(chart.id)}
            onSelectionChange={onChartSelectionChange}
          />
        ))}
      </ul>
    </div>
  );
};

export default ChartListSimple;
