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

    // add unique id to chart
    const newChart = { ...chart, id: uuidv4() };

    charts.push(newChart);
    localStorage.setItem(chartStorageKey, JSON.stringify(charts));

    // return the saved chart
    return Promise.resolve(newChart);
  });

// TODO: update existing chart
