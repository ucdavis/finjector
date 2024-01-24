import { Coa, ChartData } from "../../types";
import FinButton from "../Shared/FinButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faBolt,
  faBookmark,
  faClone,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  chartData: ChartData;
  savedChart: Coa;
  save: () => void;
  copy: () => void;
  remove: () => void;
  use: () => void;
  isLoading: boolean;
  isInPopup: boolean;
}

// Handle remove, save, copy and use buttons
const EntryEditButtons = (props: Props) => {
  const { savedChart, save, copy, remove, use, isLoading, isInPopup } = props;

  return (
    <div className="d-flex justify-content-between">
      {savedChart.canEdit && (
        <FinButton
          className="flex-fill"
          disabled={isLoading}
          onClick={remove}
          margin={false}
        >
          <FontAwesomeIcon icon={faTrash} />
          Remove
        </FinButton>
      )}
      <FinButton
        className="flex-fill"
        disabled={isLoading || !props.savedChart.name}
        onClick={copy}
      >
        <FontAwesomeIcon icon={faClone} />
        Duplicate
      </FinButton>
      {savedChart.canEdit && (
        <FinButton
          className="flex-fill"
          disabled={isLoading || !props.savedChart.name}
          onClick={save}
        >
          <FontAwesomeIcon icon={faBookmark} />
          Save
        </FinButton>
      )}
      {isInPopup && (
        <FinButton className="flex-fill" onClick={use}>
          <FontAwesomeIcon icon={faBolt} />
          Use
        </FinButton>
      )}
    </div>
  );
};

export default EntryEditButtons;
