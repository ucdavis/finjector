import React from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useSegmentQuery } from "../queries/segmentQueries";
import { ChartType } from "../types";

interface Props {
  chartType: ChartType;
  segmentName: string; // the segment to search for
  segmentValue?: string; // the value of the segment
  setSegmentValue: (segmentValue: string) => void;
}

const SegmentSearch = (props: Props) => {
  console.log(props);

  const segmentQuery = useSegmentQuery(
    ChartType.PPM,
    props.segmentName,
    props.segmentValue || ""
  );

  const handleSearch = (query: string) => {
    props.setSegmentValue(query);
  };

  console.log(segmentQuery.data);
  return (
    <AsyncTypeahead
      filterBy={() => true} // don't filter since we're doing it on the server
      id="async-example"
      isLoading={segmentQuery.isLoading}
      labelKey="summary" // TODO: change to match something unique from server response
      minLength={3}
      onSearch={handleSearch}
      options={segmentQuery.data || []} // data
      placeholder={`Search for ${props.segmentName}...`}
      renderMenuItemChildren={(option: any) => (
        <>
          <span>testing, option values rendered here {option.summary}</span>
        </>
      )}
    />
  );
};

export default SegmentSearch;
