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
  const taskDefaultChecked = React.useRef(false);
  const taskQuery = useTaskQuery(
    props.segmentDependency.code,
    props.segmentDependency.isValid
  );

  React.useEffect(() => {
    taskDefaultChecked.current = false;
  }, [props.segmentDependency.code, props.segmentDependency.isValid]);

  React.useEffect(() => {
    if (
      taskDefaultChecked.current ||
      !props.segmentDependency.isValid ||
      taskQuery.isFetching ||
      !taskQuery.isSuccess
    ) {
      return;
    }

    // Defaults are considered once per project, preserving saved and edited tasks.
    taskDefaultChecked.current = true;
    if (props.segmentData.code || taskQuery.data.length !== 1) {
      return;
    }

    const task = taskQuery.data[0];
    props.setSegmentValue({
      ...props.segmentData,
      code: task.code,
      name: task.name,
      isValid: true,
    });
  }, [props, taskQuery.data, taskQuery.isFetching, taskQuery.isSuccess]);

  const handleSelected = (selected: any) => {
    taskDefaultChecked.current = true;
    const task = selected[0];
    props.setSegmentValue({
      ...props.segmentData,
      code: task?.code || "",
      name: task?.name || "",
      isValid: !!task,
    });
  };

  const segmentNameDisplay = React.useMemo(
    () => getSegmentNameDisplay(props.segmentData, taskQuery.data),
    [props.segmentData, taskQuery.data]
  );

  return (
    <div className="mb-3 col-sm-6">
      <label className="form-label">Task</label>
      <Typeahead
        key={props.segmentDependency.code}
        id="task-selector"
        labelKey="code"
        onChange={handleSelected}
        options={taskQuery.data || []}
        isLoading={taskQuery.isFetching}
        placeholder="Choose a task..."
        selected={props.segmentData.code ? [props.segmentData] : []}
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
