import { Coa, ChartData } from "../../types";
import FinButton from "../Shared/FinButton";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
  saveAndUse: () => void;
  isLoading: boolean;
  isInPopup: boolean;
}

const EntrySaveAndUseButton = (props: Props) => {
  const { savedChart, saveAndUse, isLoading, isInPopup } = props;

  return (
    <div className="d-flex">
      <FinButton
        className="flex-fill"
        disabled={isLoading || !savedChart.name}
        onClick={saveAndUse}
        margin={false}
      >
        {isInPopup ? "Save and use" : "Save"}
      </FinButton>
    </div>
  );
};

export default EntrySaveAndUseButton;
