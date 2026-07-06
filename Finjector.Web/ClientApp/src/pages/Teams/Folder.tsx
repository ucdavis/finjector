import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import ChartListSimple from "../../components/Folders/ChartListSimple";
import PageBody from "../../components/Shared/Layout/PageBody";
import { Coa, FinQueryStatus } from "../../types";
import FolderTitle from "../../components/Folders/FolderTitle";
import { useFinQueryStatus } from "../../util/error";
import { useRemoveChart, useSaveChart } from "../../queries/storedChartQueries";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";

// show folder info w/ charts
const Folder: React.FC = () => {
  const { teamId = "", folderId = "" } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const [search, setSearch] = React.useState("");
  const [selectedChartIds, setSelectedChartIds] = React.useState<number[]>([]);
  const [deletedChartIds, setDeletedChartIds] = React.useState<number[]>([]);
  const [recentlyDeletedCharts, setRecentlyDeletedCharts] = React.useState<
    Coa[]
  >([]);

  const folderModelQuery = useGetFolder(folderId);
  const removeChartMutation = useRemoveChart();
  const saveChartMutation = useSaveChart();

  const queryStatus: FinQueryStatus = useFinQueryStatus(folderModelQuery);

  const charts = React.useMemo(
    () =>
      (folderModelQuery.data?.charts ?? []).filter(
        (chart) => !deletedChartIds.includes(chart.id)
      ),
    [deletedChartIds, folderModelQuery.data?.charts]
  );

  const selectedCharts = React.useMemo(
    () => charts.filter((chart) => selectedChartIds.includes(chart.id)),
    [charts, selectedChartIds]
  );

  const clearUndoDelete = () => {
    if (recentlyDeletedCharts.length > 0) {
      setRecentlyDeletedCharts([]);
    }
  };

  const updateChartSelection = (chartId: number, selected: boolean) => {
    clearUndoDelete();
    setSelectedChartIds((current) => {
      if (selected) {
        return current.includes(chartId) ? current : [...current, chartId];
      }

      return current.filter((id) => id !== chartId);
    });
  };

  const selectAllVisibleCharts = (chartIds: number[]) => {
    clearUndoDelete();
    setSelectedChartIds((current) =>
      Array.from(new Set([...current, ...chartIds]))
    );
  };

  const unselectVisibleCharts = (chartIds: number[]) => {
    clearUndoDelete();
    setSelectedChartIds((current) =>
      current.filter((chartId) => !chartIds.includes(chartId))
    );
  };

  const updateSearch: React.Dispatch<React.SetStateAction<string>> = (
    value
  ) => {
    clearUndoDelete();
    setSearch(value);
  };

  const onSelectedChartsExported = () => {
    clearUndoDelete();
  };

  const deleteSelectedCharts = async () => {
    if (selectedCharts.length === 0) return;

    const chartsToDelete = [...selectedCharts];

    try {
      await Promise.all(
        chartsToDelete.map((chart) => removeChartMutation.mutateAsync(chart))
      );

      setDeletedChartIds((current) =>
        Array.from(new Set([...current, ...chartsToDelete.map((c) => c.id)]))
      );
      setRecentlyDeletedCharts(chartsToDelete);
      setSelectedChartIds([]);
      addFinToast(
        "success",
        `${chartsToDelete.length} chart string${
          chartsToDelete.length === 1 ? "" : "s"
        } deleted. You can undelete ${
          chartsToDelete.length === 1 ? "it" : "them"
        } from Actions until you do something else.`
      );
      await folderModelQuery.refetch();
    } catch {
      addFinToast("error", "Error deleting selected chart strings.");
    }
  };

  const undoDeleteCharts = async () => {
    if (recentlyDeletedCharts.length === 0) return;

    const chartsToRestore = [...recentlyDeletedCharts];
    const folder = folderModelQuery.data?.folder;

    try {
      await Promise.all(
        chartsToRestore.map((chart) =>
          saveChartMutation.mutateAsync({
            ...chart,
            id: 0,
            folderId: chart.folderId ?? folder?.id,
            folder: undefined,
          })
        )
      );

      setDeletedChartIds((current) =>
        current.filter(
          (chartId) => !chartsToRestore.some((chart) => chart.id === chartId)
        )
      );
      setRecentlyDeletedCharts([]);
      addFinToast(
        "success",
        `${chartsToRestore.length} chart string${
          chartsToRestore.length === 1 ? "" : "s"
        } restored.`
      );
      await folderModelQuery.refetch();
    } catch {
      addFinToast("error", "Error restoring deleted chart strings.");
    }
  };

  return (
    <div>
      <FolderTitle
        folderModelData={folderModelQuery.data}
        queryStatus={queryStatus}
        teamId={teamId}
        folderId={folderId}
        selectedCharts={selectedCharts}
        recentlyDeletedChartCount={recentlyDeletedCharts.length}
        selectedActionPending={removeChartMutation.isPending}
        undoDeletePending={saveChartMutation.isPending}
        onDeleteSelectedCharts={deleteSelectedCharts}
        onUndoDeleteCharts={undoDeleteCharts}
        onSelectedChartsExported={onSelectedChartsExported}
      />
      <PageBody>
        <SearchBar
          placeholderText="Search Within Folder"
          search={search}
          setSearch={updateSearch}
        />
        <ChartListSimple
          charts={charts}
          folder={folderModelQuery.data?.folder}
          filter={search}
          queryStatus={queryStatus}
          selectedChartIds={selectedChartIds}
          onChartSelectionChange={updateChartSelection}
          onSelectAllVisibleCharts={selectAllVisibleCharts}
          onUnselectVisibleCharts={unselectVisibleCharts}
        />
      </PageBody>
    </div>
  );
};

export default Folder;
