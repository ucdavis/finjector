import { useQuery } from "@tanstack/react-query";
import { ChartType, SegmentData } from "../types";
import { doFetch } from "../util/api";

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
