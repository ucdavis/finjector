import { useQuery } from "@tanstack/react-query";
import { ChartType } from "../types";
import { doFetch } from "../util/api";

export const useSegmentQuery = (
  chartType: ChartType,
  segmentName: string,
  query: string
) =>
  useQuery(["segments", chartType, segmentName, query], () =>
    doFetch<any>(fetch("/weatherforecast?" + query)), {
      enabled: query?.length > 2,
      staleTime: 1000 * 60 // don't requery same search term for 1 minute
    }
  );
