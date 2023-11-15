import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Chart, ChartType } from "../types";
import { doFetch } from "../util/api";

// Using query functions here in case we change to async/stored stirngs later
export const useGetSavedCharts = () =>
  useQuery(["charts", "me"], async () => {
    const charts = await doFetch<Chart[]>(fetch(`/api/charts/all`));

    return charts;
  });

// pull saved chart and return hydrated chartData from server
export const useGetSavedChartWithData = (id: string) =>
  useQuery(
    ["charts", "saved", id],
    async () => {
      const chart = await doFetch<Chart>(fetch(`/api/charts/${id}`));

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
    { enabled: id.length > 0 }
  );

// save new chart
export const useSaveChart = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (chart: Chart) => {
      const response = await fetch(`/api/charts/save`, {
        method: "POST",
        body: JSON.stringify(chart),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const responseChart = await response.json();

      // return the saved chart
      return responseChart;
    },
    {
      onSuccess: (chart) => {
        // invalidate the charts query so we can get the new chart
        queryClient.invalidateQueries(["charts", "me"]);
        queryClient.invalidateQueries(["charts", "saved", chart.id]);
      },
    }
  );
};

// delete chart
export const useRemoveChart = () => {
  const queryClient = useQueryClient();

  return useMutation(async (chart: Chart) => {
    await fetch(`/api/charts/delete/${chart.id}`, {
      method: "DELETE",
    });

    return chart;
  }, {
    onSuccess: (chart) => {
      // invalidate the charts query so we re-query the list
      queryClient.invalidateQueries(["charts", "me"]);
    }
  });
};
