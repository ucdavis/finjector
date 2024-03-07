import { useQuery } from '@tanstack/react-query';

import { ChartType, SegmentData } from '../types';
import { doFetch } from '../util/api';

// search a specific segment
export const useSegmentQuery = (
  chartType: ChartType,
  segmentName: string,
  query: string,
  dependency?: string,
  minQueryLength = 3
) =>
  useQuery({
    queryKey: ['segments', chartType, segmentName, query, dependency],
    queryFn: () => {
      const controller = chartType === ChartType.GL ? 'glsearch' : 'ppmsearch';

      return doFetch<SegmentData[]>(
        fetch(
          `/api/${controller}/${segmentName}?query=${query}&dependency=${dependency}`
        )
      );
    },
    enabled: query?.length >= minQueryLength, // matches the minimum length of our async search
    staleTime: 1000 * 60, // don't requery same search term for 1 minute
  });

// grab all tasks for the given project
export const useTaskQuery = (projectNumber: string, projectValid: boolean) =>
  useQuery({
    queryKey: ['segments', ChartType.PPM, 'task', projectNumber],
    queryFn: () => {
      return doFetch<SegmentData[]>(
        fetch(`/api/ppmsearch/tasksByProject?projectNumber=${projectNumber}`)
      );
    },
    enabled: projectValid,
    staleTime: 1000 * 60, // don't requery same search term for 1 minute
  });

// search a full segment string
export const useSegmentStringQuery = (
  chartType: ChartType,
  segmentString: string
) =>
  useQuery({
    queryKey: ['segmentString', chartType, segmentString],
    queryFn: () => {
      const controller = chartType === ChartType.GL ? 'glsearch' : 'ppmsearch';

      return doFetch<SegmentData[]>(
        fetch(`/api/${controller}/fullstring?segmentString=${segmentString}`)
      );
    },
    enabled: segmentString?.length > 0,
  });

// validate a full segment string, including getting back segment data
export const useSegmentValidateQuery = (
  chartType: ChartType,
  segmentString: string,
  enabled: boolean
) =>
  useQuery({
    queryKey: ['validate', chartType, segmentString],
    queryFn: () => {
      const controller = chartType === ChartType.GL ? 'glsearch' : 'ppmsearch';

      return doFetch<SegmentValidateQueryResponse>(
        fetch(`/api/${controller}/validate?segmentString=${segmentString}`)
      );
    },
    enabled,
  });

export interface ValidationResponse {
  errorMessages: string[];
  valid: boolean;
}

export interface SegmentValidateQueryResponse {
  segmentString: string;
  segments: { [key: string]: string }; // dictionary of segment name to segment value
  validationResponse: ValidationResponse;
}
