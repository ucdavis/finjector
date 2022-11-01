import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { Chart, ChartType } from "../types";
import { doFetch } from "../util/api";

const chartStorageKey = "STORED_CHARTS";

// Using query functions here in case we change to async/stored stirngs later
export const useGetSavedCharts = () =>
  useQuery(["charts", "me"], () =>
    Promise.resolve<Chart[]>(
      JSON.parse(localStorage.getItem(chartStorageKey) || "[]")
    )
  );

// pull saved chart (from local storage) and also return hydrated chartData from server
export const useGetSavedChartWithData = (id: string) =>
  useQuery(
    ["charts", "saved", id],
    async () => {
      var charts: Chart[] = JSON.parse(
        localStorage.getItem(chartStorageKey) || "[]"
      );

      const chart = charts.find((chart) => chart.id === id) || null;

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
  useMutation((chart: Chart) => {
    const charts: Chart[] = JSON.parse(
      localStorage.getItem(chartStorageKey) || "[]"
    );

    let savedChart: Chart;

    // if we have an id, update the existing chart
    if (chart.id) {
      const existingChart = charts.find((c) => c.id === chart.id);

      if (existingChart) {
        existingChart.displayName = chart.displayName;
        existingChart.segmentString = chart.segmentString;
        existingChart.chartType = chart.chartType;
        savedChart = existingChart;
      } else {
        throw new Error("Chart not found with ID " + chart.id);
      }
    } else {
      // otherwise, add a new chart
      // add unique id to chart
      const newChart = { ...chart, id: uuidv4() };

      charts.push(newChart);
      savedChart = newChart;
    }

    localStorage.setItem(chartStorageKey, JSON.stringify(charts));

    // return the saved chart
    return Promise.resolve(savedChart);
  });

// delete chart
export const useRemoveChart = () =>
  useMutation((chart: Chart) => {
    const charts: Chart[] = JSON.parse(
      localStorage.getItem(chartStorageKey) || "[]"
    );

    const index = charts.findIndex((c) => c.id === chart.id);

    if (index > -1) {
      charts.splice(index, 1);
    }

    localStorage.setItem(chartStorageKey, JSON.stringify(charts));

    return Promise.resolve(chart);
  });
