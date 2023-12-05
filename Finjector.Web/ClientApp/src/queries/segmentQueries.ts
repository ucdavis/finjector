import { useQuery } from "@tanstack/react-query";
import { ChartType, SegmentData } from "../types";
import { doFetch } from "../util/api";

// search a specific segment
export const useSegmentQuery = (
  chartType: ChartType,
  segmentName: string,
  query: string,
  dependency?: string,
  minQueryLength = 3
) =>
  useQuery(
    ["segments", chartType, segmentName, query, dependency],
    () => {
      const controller = chartType === ChartType.GL ? "glsearch" : "ppmsearch";

      return doFetch<SegmentData[]>(
        fetch(
          `/api/${controller}/${segmentName}?query=${query}&dependency=${dependency}`
        )
      );
    },
    {
      enabled: query?.length >= minQueryLength, // matches the minimum length of our async search
      staleTime: 1000 * 60, // don't requery same search term for 1 minute
      refetchOnWindowFocus: false,
    }
  );

// grab all tasks for the given project
export const useTaskQuery = (projectNumber: string, projectValid: boolean) =>
  useQuery(
    ["segments", ChartType.PPM, "task", projectNumber],
    () => {
      return doFetch<SegmentData[]>(
        fetch(`/api/ppmsearch/tasksByProject?projectNumber=${projectNumber}`)
      );
    },
    {
      enabled: projectValid,
      staleTime: 1000 * 60, // don't requery same search term for 1 minute
      refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
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
