import { useQuery } from "@tanstack/react-query";
import { ChartType, SegmentData } from "../types";
import { doFetch } from "../util/api";

// search a specific segment
export const useSegmentQuery = (
  chartType: ChartType,
  segmentName: string,
  query: string
) =>
  useQuery(
    ["segments", chartType, segmentName, query],
    () => {
      const controller = chartType === ChartType.GL ? "glsearch" : "ppmsearch";

      return doFetch<SegmentData[]>(
        fetch(`/api/${controller}/${segmentName}?query=${query}`)
      );
    },
    {
      enabled: query?.length > 2, // matches the minimum length of our async search
      staleTime: 1000 * 60, // don't requery same search term for 1 minute
    }
  );

// search a full segment string
export const useSegmentStringQuery = (
  chartType: ChartType,
  segmentString: string
) =>
  useQuery(
    ["segmentString", chartType, segmentString],
    () => {
      const controller = chartType === ChartType.GL ? "glsearch" : "ppmsearch";

      return doFetch<SegmentData[]>(
        fetch(`/api/${controller}/fullstring?segmentString=${segmentString}`)
      );
    },
    {
      enabled: segmentString?.length > 0,
    }
  );

// validate a full segment string, including getting back segment data
export const useSegmentValidateQuery = (
  chartType: ChartType,
  segmentString: string,
  enabled: boolean
) =>
  useQuery(
    ["validate", chartType, segmentString],
    () => {
      const controller = chartType === ChartType.GL ? "glsearch" : "ppmsearch";

      return doFetch<SegmentValidateQueryResponse>(
        fetch(`/api/${controller}/validate?segmentString=${segmentString}`)
      );
    },
    {
      enabled,
    }
  );

export interface ValidationResponse {
  errorMessages: string[];
  valid: boolean;
}

export interface SegmentValidateQueryResponse {
  segmentString: string;
  segments: { [key: string]: string }; // dictionary of segment name to segment value
  validationResponse: ValidationResponse;
}
