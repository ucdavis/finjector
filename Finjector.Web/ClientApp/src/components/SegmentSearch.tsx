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
  const segmentQuery = useSegmentQuery(
    ChartType.PPM,
    props.segmentName,
    props.segmentValue || ""
  );

  const handleSearch = (query: string) => {
    props.setSegmentValue(query);
  };

  return (
    <AsyncTypeahead
      filterBy={() => true} // don't filter since we're doing it on the server
      id="async-example"
      isLoading={segmentQuery.isLoading}
      labelKey="code" // TODO: change to match something unique from server response
      minLength={3}
      onSearch={handleSearch}
      options={segmentQuery.data || []} // data
      placeholder={`Search for ${props.segmentName}...`}
      renderMenuItemChildren={(option: any) => (
        <>
          <h5>{option.code}</h5>
          <span>{option.name}</span>
        </>
      )}
    />
  );
};

export default SegmentSearch;
