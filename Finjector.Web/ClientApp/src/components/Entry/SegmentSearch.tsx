import React from "react";

import {
  AsyncTypeahead,
  TypeaheadInputSingle,
  TypeaheadMenu,
} from "react-bootstrap-typeahead";
import { useSegmentQuery } from "../../queries/segmentQueries";
import { ChartType, SegmentData } from "../../types";
// CSS
// https://github.com/ericgio/react-bootstrap-typeahead/issues/713 warning w/ bootstrap 5
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

interface Props {
  chartType: ChartType;
  segmentData: SegmentData;
  setSegmentValue: (data: SegmentData) => void;
  minQueryLength?: number;
  errorId?: string;
}

export function getSegmentNameDisplay(
  segmentData: SegmentData,
  segmentQueryData: SegmentData[] | undefined
): string {
  if (segmentQueryData) {
    const segment = segmentQueryData.find(
      (s: any) => s.code === segmentData.code
    );
    if (segment) {
      return segment.name;
    } else {
      return `${segmentData.segmentName} not selected`;
    }
  } else {
    return segmentData.name || `${segmentData.segmentName} not selected`;
  }
}

// The library exposes the mounted listbox through aria-owns.
export const renderSearchInput: NonNullable<
  React.ComponentProps<typeof AsyncTypeahead>["renderInput"]
> = (inputProps) => (
  <TypeaheadInputSingle {...inputProps} aria-controls={inputProps["aria-owns"]} />
);

export const renderSegmentMenu: NonNullable<
  React.ComponentProps<typeof AsyncTypeahead>["renderMenu"]
> = (options, menuProps, { text }) => (
  <TypeaheadMenu
    {...menuProps}
    options={options}
    text={text}
    labelKey={(option) =>
      typeof option === "string" ? option : `${option.code} ${option.name}`
    }
    renderMenuItemChildren={(option) =>
      typeof option === "string" ? <span>{option}</span> : (
        <>
          <strong className="d-block">{option.code}</strong>
          <span>{option.name}</span>
        </>
      )
    }
  />
);

const SegmentSearch = (props: Props) => {
  const minQueryLength = props.minQueryLength || 3;
  const inputId = `segment-${props.segmentData.segmentName}`;

  // takes camelCaseString and splits into words
  const prettifiedName = props.segmentData.segmentName.replace(
    /([a-z0-9])([A-Z])/g,
    "$1 $2"
  );

  const segmentQuery = useSegmentQuery(
    props.chartType,
    props.segmentData.segmentName,
    props.segmentData.code,
    "",
    minQueryLength
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
        glPostingDepartmentCode: selected[0].glPostingDepartmentCode,
      });
    }
  };

  const segmentNameDisplay = React.useMemo(
    () => getSegmentNameDisplay(props.segmentData, segmentQuery.data),
    [props.segmentData, segmentQuery.data]
  );

  // notes: this async typeahead will be configured a little differently than normal, since we want to bind the text values at all times
  // 1. our query will handle caching, so turn off the cache or we won't get full results
  // 2. onSearch is request but we don't really need it, so watch as the input changes to reset the segment data
  // 3. we only care about setting full segment info (code+name) when a selection is made
  // 4. this does result in an extra query when the full value is selected -- we could optimize but this is minor and might actually prove useful
  return (
    <div className="mb-3 col-sm-6">
      <label className="form-label" htmlFor={inputId}>
        {prettifiedName}
      </label>
      <AsyncTypeahead
        id={`${inputId}-options`}
        inputProps={{
          id: inputId,
          "aria-invalid": props.errorId ? true : undefined,
          "aria-describedby": [props.errorId, `${inputId}-help`].filter(Boolean).join(" "),
        }}
        renderInput={renderSearchInput}
        filterBy={() => true} // don't filter since we're doing it on the server
        isLoading={segmentQuery.isFetching}
        labelKey="code"
        minLength={0} // to show "Type to search" before the user has started typing, we have to set minLength to 0. however, useSegmentQuery won't do anything until it meets minLength
        onSearch={() => {}}
        promptText={
          segmentQuery.isFetching
            ? "Searching..."
            : !!segmentQuery.data && segmentQuery.data.length === 0
            ? "No matches found."
            : `Type at least ${minQueryLength} characters to search.`
        }
        onInputChange={handleInputChange}
        defaultInputValue={
          props.segmentData.isValid ? undefined : props.segmentData.code
        }
        selected={props.segmentData.isValid ? [props.segmentData] : []}
        onChange={handleSelected}
        useCache={false}
        options={segmentQuery.data || []} // data
        placeholder={`Search for ${props.segmentData.segmentName}...`}
        renderMenu={renderSegmentMenu}
      />
      <div id={`${inputId}-help`} className="form-text">
        {segmentQuery.isError
          ? "Unable to search for this segment. Try again."
          : segmentNameDisplay}
      </div>
    </div>
  );
};

export default SegmentSearch;
