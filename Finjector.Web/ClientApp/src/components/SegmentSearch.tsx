import React from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useSegmentQuery } from "../queries/segmentQueries";
import { ChartType, SegmentData } from "../types";

interface Props {
  chartType: ChartType;
  segmentName: string; // the segment name/key to search for
  segmentData: SegmentData;
  setSegmentValue: (data: SegmentData) => void;
}

const SegmentSearch = (props: Props) => {
  const segmentQuery = useSegmentQuery(
    ChartType.PPM,
    props.segmentName,
    props.segmentData.code
  );

  const handleSearch = (query: string) => {
    props.setSegmentValue({ ...props.segmentData, code: query });
  };

  // TODO, update name when selected

  return (
    <AsyncTypeahead
      filterBy={() => true} // don't filter since we're doing it on the server
      id="async-example"
      isLoading={segmentQuery.isLoading}
      labelKey="code"
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
