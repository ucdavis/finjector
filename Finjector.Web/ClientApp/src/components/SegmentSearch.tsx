import React from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useSegmentQuery } from "../queries/segmentQueries";
import { ChartType, SegmentData } from "../types";

interface Props {
  chartType: ChartType;
  segmentName: string; // the segment name/key to search for
  segmentData: SegmentData;
  segmentDependency?: SegmentData; // optional segment data that this segment depends on
  segmentDependencyRequired?: boolean; // optional flag to indicate that the dependency is required
  setSegmentValue: (data: SegmentData) => void;
}

const SegmentSearch = (props: Props) => {
  // takes camelCaseString and splits into words
  const prettifiedName = props.segmentName.replace(
    /([a-z0-9])([A-Z])/g,
    "$1 $2"
  );

  const segmentQuery = useSegmentQuery(
    props.chartType,
    props.segmentName,
    props.segmentData.code,
    props.segmentDependency?.code
  );

  const handleInputChange = (query: string) => {
    props.setSegmentValue({
      ...props.segmentData,
      code: query,
      name: "",
      isValid: false,
    });
  };

  const handleSelected = (selected: any) => {
    if (selected.length > 0) {
      props.setSegmentValue({
        ...props.segmentData,
        code: selected[0].code,
        name: selected[0].name,
        isValid: true,
      });
    }
  };

  // notes: this async typeahead will be configured a little differently than normal, since we want to bind the text values at all times
  // 1. our query will handle caching, so turn off the cache or we won't get full results
  // 2. onSearch is request but we don't really need it, so watch as the input changes to reset the segment data
  // 3. we only care about setting full segment info (code+name) when a selection is made
  // 4. this does result in an extra query when the full value is selected -- we could optimize but this is minor and might actually prove useful
  return (
    <div className="mb-3 col-sm-6">
      <label className="form-label text-uppercase">{prettifiedName}</label>
      <AsyncTypeahead
        id={"typeahead" + props.segmentName}
        disabled={
          props.segmentDependencyRequired && !props.segmentDependency?.isValid
        }
        filterBy={() => true} // don't filter since we're doing it on the server
        isLoading={segmentQuery.isFetching}
        labelKey="code"
        minLength={3}
        onSearch={() => {}}
        onInputChange={handleInputChange}
        defaultInputValue={props.segmentData.code}
        onChange={handleSelected}
        useCache={false}
        options={segmentQuery.data || []} // data
        placeholder={`Search for ${props.segmentName}...`}
        renderMenuItemChildren={(option: any) => (
          <>
            <h5>{option.code}</h5>
            <span>{option.name}</span>
          </>
        )}
      />
      <div className="form-text">
        {props.segmentData.name || `${props.segmentName} not selected`}
      </div>
    </div>
  );
};

export default SegmentSearch;
