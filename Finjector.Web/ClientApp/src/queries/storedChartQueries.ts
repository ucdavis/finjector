import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

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
