import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

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
export const useSaveChart = () =>
  useMutation(async (chart: Chart) => {
    const savedChart: Chart = { ...chart, id: chart.id || uuidv4() };

    await fetch(`/api/charts/save`, {
      method: "POST",
      body: JSON.stringify(savedChart),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // return the saved chart
    return savedChart;
  });

// delete chart
export const useRemoveChart = () =>
  useMutation(async (chart: Chart) => {
    await fetch(`/api/charts/delete/${chart.id}`, {
      method: "DELETE",
    });

    return chart;
  });
