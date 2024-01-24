import { useNavigate } from "react-router-dom";
import usePopupStatus from "../../util/customHooks";
import { useRemoveChart, useSaveChart } from "../../queries/storedChartQueries";
import { Coa, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import { toast } from "react-toastify";
import EntrySaveAndUseButton from "./EntrySaveAndUseButton";
import EntryEditButtons from "./EntryEditButtons";

const landingPage = "/landing";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
}

const EntryMutationActions = (props: Props) => {
  const navigate = useNavigate();
  const isInPopup = usePopupStatus();

  const { chartData, savedChart } = props;

  const saveMutation = useSaveChart();
  const removeMutation = useRemoveChart();

  const save = () => {
    const chartToSave: Coa = {
      ...savedChart,
      segmentString: toSegmentString(chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        toast.success("Chart string saved.");
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folderId}/details/${data.id}/${chartToSave.segmentString}`
        );
      },
      onError: (error) => {
        toast.error("Error saving chart string.");
      },
    });
  };

  const copy = () => {
    // create a new chart based on the starting point of current chart
    const chartToSave: Coa = {
      ...savedChart,
      folderId: savedChart.folderId || 0,
      id: 0,
      name: `${props.savedChart.name}`,
      segmentString: toSegmentString(props.chartData),
    };

    //teams/1/folders/1/details/1/3110-13U20-ADNO003-238533-00-000-0000000000-000000-0000-000000-000000
    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        toast.success("Chart string duplicated.");
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folderId}/details/${data.id}/${chartToSave.segmentString}`
        );
      },
      onError: (error) => {
        toast.error("Error duplicating chart string.");
      },
    });
  };

  const remove = () => {
    removeMutation.mutate(props.savedChart, {
      onSuccess: () => {
        toast.success("Chart string removed.");
        navigate(landingPage);
      },
      onError: (error) => {
        toast.error("Error removing chart string.");
      },
    });
  };

  const use = () => {
    navigate(
      `/teams/${savedChart.folder?.teamId}/folders/${
        savedChart.folder?.id
      }/selected/${savedChart.id}/${toSegmentString(props.chartData)}`
    );
  };

  const saveAndUse = () => {
    const chartToSave: Coa = {
      ...props.savedChart,
      chartType: props.chartData.chartType,
      segmentString: toSegmentString(chartData),
    };

    saveMutation.mutate(chartToSave, {
      onSuccess: (data) => {
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folder?.id}/${
            isInPopup ? "selected" : "details"
          }/${data.id}/${data.segmentString}`
        );
      },
      onError: (error) => {
        toast.error("Error saving chart string.");
      },
    });
  };

  if (savedChart.id) {
    return (
      <EntryEditButtons
        chartData={chartData}
        savedChart={savedChart}
        isLoading={saveMutation.isLoading || removeMutation.isLoading}
        save={save}
        copy={copy}
        remove={remove}
        use={use}
        isInPopup={isInPopup}
      />
    );
  }
  return (
    <EntrySaveAndUseButton
      chartData={chartData}
      savedChart={savedChart}
      saveAndUse={saveAndUse}
      isLoading={saveMutation.isLoading}
      isInPopup={isInPopup}
    />
  );
};

export default EntryMutationActions;
