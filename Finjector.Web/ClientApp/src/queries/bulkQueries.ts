import { useMutation } from "@tanstack/react-query";
import { doFetchWithTextError } from "../util/api";

export interface ChartValidationResult {
  chartString: string;
  isValid: boolean;
  isWarning: boolean;
  errorMessage: string;
}

export const useValidateBulkChartsMutation = () =>
  useMutation({
    mutationFn: async (chartStrings: string) => {
      return await doFetchWithTextError<ChartValidationResult[]>(
        fetch(`/api/bulk?chartStrings=${encodeURIComponent(chartStrings)}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
      );
    },
  });
