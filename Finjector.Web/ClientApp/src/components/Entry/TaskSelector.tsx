import React from "react";

import { Typeahead } from "react-bootstrap-typeahead";
import { useTaskQuery } from "../../queries/segmentQueries";
import { SegmentData } from "../../types";
import { getSegmentNameDisplay } from "./SegmentSearch";

interface Props {
  segmentData: SegmentData; // task segment
  segmentDependency: SegmentData; // project segment
  setSegmentValue: (data: SegmentData) => void;
}

const TaskSelector = (props: Props) => {
  const [selection, setSelection] = React.useState<SegmentData[]>([
    props.segmentData,
  ]);

  const taskQuery = useTaskQuery(
    props.segmentDependency.code,
    props.segmentDependency.isValid
  );

  // if the segment dependency is not valid, clear the selection
  React.useEffect(() => {
    if (!props.segmentDependency.isValid && selection.length > 0) {
      setSelection([]);

      // clear the segment data
      props.setSegmentValue({
        ...props.segmentData,
        code: "",
        name: "",
        isValid: false,
      });
    }
  }, [props, props.segmentDependency.isValid, selection.length]);

  const handleSelected = (selected: any) => {
    setSelection(selected);

    if (selected.length > 0) {
      props.setSegmentValue({
        ...props.segmentData,
        code: selected[0].code,
        name: selected[0].name,
        isValid: true,
      });
    }
  };

  const segmentNameDisplay = React.useMemo(
    () => getSegmentNameDisplay(props.segmentData, taskQuery.data),
    [props.segmentData, taskQuery.data]
  );

  return (
    <div className="mb-3 col-sm-6">
      <label className="form-label">Task</label>
      <Typeahead
        id="task-selector"
        labelKey="code"
        onChange={handleSelected}
        options={taskQuery.data || []}
        isLoading={taskQuery.isFetching}
        placeholder="Choose a task..."
        selected={selection}
        disabled={!props.segmentDependency?.isValid}
        renderMenuItemChildren={(option: any) => (
          <>
            <h5>{option.code}</h5>
            <span>{option.name}</span>
          </>
        )}
      />
      <div className="form-text">{segmentNameDisplay}</div>
    </div>
  );
};

export default TaskSelector;
