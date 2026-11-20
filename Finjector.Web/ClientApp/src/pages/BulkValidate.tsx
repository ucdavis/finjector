import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChartValidationStatus, {
  ChartValidationState,
} from "../components/Shared/ChartValidationStatus";
import FinButton from "../components/Shared/FinButton";
import PageTitle from "../components/Shared/Layout/PageTitle";
import {
  ChartValidationResult,
  useValidateBulkChartsMutation,
} from "../queries/bulkQueries";
import FinLoader from "../components/Shared/LoadingAndErrors/FinLoader";

const getValidationStatus = (result: ChartValidationResult): ChartValidationState => {
  if (!result.isValid) return "Invalid";
  return result.isWarning ? "Warning" : "Valid";
};

const BulkValidate = () => {
  const [chartStrings, setChartStrings] = useState<string>("");
  const validateMutation = useValidateBulkChartsMutation();

  const handleValidate = () => {
    if (!chartStrings.trim()) {
      return;
    }

    validateMutation.mutate(chartStrings);
  };

  return (
    <div className="main">
      <PageTitle title="Bulk Chart String Validation" />

      <div className="mb-3">
        <label htmlFor="chart-strings-input" className="form-label">
          Paste in chart strings separated by commas, spaces, or newlines
          (maximum 200)
        </label>
        <textarea
          className="form-control"
          id="chart-strings-input"
          rows={10}
          value={chartStrings}
          onChange={(e) => setChartStrings(e.target.value)}
          placeholder="ex: 1311-63031-9300531-508210-44-G29-CM00000039-510139-0000-000000-000000&#10;2222-22222-2222222-222222-22-G22-CM00000022-222222-2222-222222-222222"
        />
      </div>

      <FinButton
        onClick={handleValidate}
        disabled={validateMutation.isPending || !chartStrings.trim()}
      >
        {validateMutation.isPending
          ? "Validating..."
          : "Validate Chart Strings"}
      </FinButton>

      {validateMutation.isPending && <FinLoader />}

      <div role="status" className="visually-hidden">
        {validateMutation.isSuccess &&
          `Validation complete. Results for ${validateMutation.data.length} chart strings are available below.`}
      </div>

      {validateMutation.isError && (
        <div className="alert alert-danger mt-3" role="alert">
          {validateMutation.error?.message ||
            "An error occurred during validation."}
        </div>
      )}

      {validateMutation.isSuccess && validateMutation.data && (
        <div className="mt-4">
          <h2 id="validation-results-heading">Validation Results</h2>
          <table className="table table-striped text-break" aria-labelledby="validation-results-heading">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Chart String</th>
                <th scope="col">Message</th>
              </tr>
            </thead>
            <tbody>
              {validateMutation.data.map((result, index) => (
                <tr key={index}>
                  <td>
                    <ChartValidationStatus status={getValidationStatus(result)} />
                  </td>
                  <td>
                    <code>
                      <Link
                        to={`/details/${result.chartString}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {result.chartString}
                      </Link>
                    </code>
                  </td>
                  <td>{result.errorMessage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkValidate;
