import { useNavigate, useParams } from "react-router-dom";
import { useRemoveChart } from "../../queries/storedChartQueries";
import { Coa } from "../../types";
import FinjectorButton from "./FinjectorButton";

export const ChartLoadingError = () => {
  const navigate = useNavigate();
  const { id: chartId } = useParams();

  const removeMutation = useRemoveChart();

  const remove = () => {
    removeMutation.mutate({ id: chartId || 0 } as Coa, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="p-2">
      <h1>Error loading chart</h1>
      <p>
        This is most likely because chart format is not supported. If you'd like
        to permanently remove this entry, click the button below.
      </p>
      <FinjectorButton
        color="danger"
        disabled={removeMutation.isLoading}
        onClick={remove}
      >
        Remove
      </FinjectorButton>
    </div>
  );
};
