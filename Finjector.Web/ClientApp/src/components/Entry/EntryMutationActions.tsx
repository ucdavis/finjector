import { useNavigate } from "react-router-dom";
import usePopupStatus from "../../util/customHooks";
import { useRemoveChart, useSaveChart } from "../../queries/storedChartQueries";
import { Coa, ChartData } from "../../types";
import { toSegmentString } from "../../util/segmentValidation";
import addFinToast from "../Shared/LoadingAndErrors/FinToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FinButton from "../Shared/FinButton";
import {
  faTrash,
  faBolt,
  faBookmark,
  faClone,
} from "@fortawesome/free-solid-svg-icons";

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
        addFinToast("success", "Chart string saved successfully.");
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folderId}/details/${data.id}/${chartToSave.segmentString}`
        );
      },
      onError: (error) => {
        addFinToast("error", "Error saving chart string.");
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
        addFinToast("success", "Chart string duplicated successfully.");
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folderId}/details/${data.id}/${chartToSave.segmentString}`
        );
      },
      onError: (error) => {
        addFinToast("error", "Error duplicating chart string.");
      },
    });
  };

  const remove = () => {
    removeMutation.mutate(props.savedChart, {
      onSuccess: () => {
        addFinToast("success", "Chart string removed successfully.");
        navigate(landingPage);
      },
      onError: (error) => {
        addFinToast("error", "Error removing chart string.");
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
        addFinToast("success", "Chart string saved successfully.");
        navigate(
          `/teams/${data.folder?.teamId}/folders/${data.folder?.id}/${
            isInPopup ? "selected" : "details"
          }/${data.id}/${data.segmentString}`
        );
      },
      onError: (error) => {
        addFinToast("error", "Error saving chart string.");
      },
    });
  };

  if (savedChart.id) {
    // if we are coming from a saved chart string
    return (
      <div className="d-flex justify-content-between">
        {savedChart.canEdit && (
          <FinButton
            className="flex-fill"
            disabled={removeMutation.isLoading || saveMutation.isLoading}
            onClick={remove}
            margin={false}
          >
            <FontAwesomeIcon icon={faTrash} />
            Remove
          </FinButton>
        )}
        <FinButton
          className="flex-fill"
          disabled={
            saveMutation.isLoading ||
            !savedChart.name ||
            removeMutation.isLoading
          }
          onClick={copy}
          margin={savedChart.canEdit} // only have a margin if it is one of multiple buttons
        >
          <FontAwesomeIcon icon={faClone} />
          Duplicate
        </FinButton>
        {savedChart.canEdit && (
          <FinButton
            className="flex-fill"
            disabled={
              saveMutation.isLoading ||
              !savedChart.name ||
              removeMutation.isLoading
            }
            onClick={save}
          >
            <FontAwesomeIcon icon={faBookmark} />
            Save
          </FinButton>
        )}
        {isInPopup && (
          <FinButton
            className="flex-fill"
            onClick={use}
            // it looks ugly and is confusing to press "use" when another action is in process
            // but i think since Use is our main action, we should allow it if another action is hanging
            // disabled={saveMutation.isLoading || removeMutation.isLoading}
          >
            <FontAwesomeIcon icon={faBolt} />
            Use
          </FinButton>
        )}
      </div>
    );
  }
  return (
    // if we are creating a new chart string from scratch
    <div className="d-flex">
      <FinButton
        className="flex-fill"
        disabled={saveMutation.isLoading || !savedChart.name}
        onClick={saveAndUse}
        margin={false}
      >
        {isInPopup ? "Save and use" : "Save"}
      </FinButton>
    </div>
  );
};

export default EntryMutationActions;
