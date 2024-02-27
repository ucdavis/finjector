import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Coa,
  ChartType,
  TeamGroupedCoas,
  ChartStringAndAeDetails,
} from "../types";
import { doFetch, doFetchEmpty } from "../util/api";

// Using query functions here in case we change to async/stored stirngs later
export const useGetSavedCharts = () =>
  useQuery({
    queryKey: ["charts", "me"],
    queryFn: async () => {
      const charts = await doFetch<TeamGroupedCoas[]>(fetch(`/api/charts/all`));

      return charts;
    },
  });

export const useGetChart = (id: string) =>
  useQuery({
    queryKey: ["charts", "basic", id],
    queryFn: async () => {
      return await doFetch<Coa>(fetch(`/api/charts/${id}`));
    },
  });

export const useGetChartDetails = (chartString: string, chartId?: string) =>
  useQuery({
    queryKey: ["charts", "details", chartString],
    queryFn: async () => {
      const chart = await doFetch<ChartStringAndAeDetails>(
        fetch(
          chartId
            ? `/api/charts/details/id?chartId=${chartId}`
            : `/api/charts/details/string?chartString=${chartString}`
        )
      );

      return chart;
    },
    enabled: chartString.length > 0,
  });

// pull saved chart and return hydrated chartData from server
export const useGetSavedChartWithData = (id: string) =>
  useQuery({
    queryKey: ["charts", "saved", id],
    queryFn: async () => {
      const chart = await doFetch<Coa>(fetch(`/api/charts/${id}`));

      if (chart) {
        // if we found the chart, load up segement values and validate
        const controller =
          chart.chartType === ChartType.GL ? "glsearch" : "ppmsearch";

        const validateResponse = await doFetch<any>(
          fetch(
            `/api/${controller}/validate?segmentString=${chart.segmentString}`
          )
        );

        return { chart, validateResponse };
      }

      return null;
    },
    enabled: id.length > 0,
  });

// save new chart
export const useSaveChart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chart: Coa) => {
      return await doFetch<Coa>(
        fetch(`/api/charts/save`, {
          method: "POST",
          body: JSON.stringify(chart),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
      );
    },
    onSuccess: (chart) => {
      // invalidate the charts query so we can get the new chart
      queryClient.invalidateQueries({ queryKey: ["charts", "me"] });
      queryClient.invalidateQueries({
        queryKey: ["charts", "saved", chart.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["charts", "details", chart.id],
      });
    },
  });
};

// delete chart
export const useRemoveChart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chart: Coa) => {
      return await doFetchEmpty(
        fetch(`/api/charts/delete/${chart.id}`, {
          method: "DELETE",
        })
      );
    },
    onSuccess: (chart) => {
      // invalidate the charts query so we re-query the list
      queryClient.invalidateQueries({ queryKey: ["charts", "me"] });
    },
  });
};
