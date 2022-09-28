import { useMutation, useQuery } from "@tanstack/react-query";
import { Chart } from "../types";

const chartStorageKey = "STORED_CHARTS";

// Using query functions here in case we change to async/stored stirngs later
export const useGetSavedCharts = () =>
  useQuery(["charts", "me"], () =>
    Promise.resolve<Chart[]>(
      JSON.parse(localStorage.getItem(chartStorageKey) || "[]")
    )
  );

// save new chart
export const useSaveChart = () =>
  useMutation((chart: Chart) => {
    const charts = JSON.parse(localStorage.getItem(chartStorageKey) || "[]");
    charts.push(chart);
    localStorage.setItem(chartStorageKey, JSON.stringify(charts));

    return Promise.resolve(charts);
  });

// TODO: update existing chart