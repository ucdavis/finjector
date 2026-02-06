import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import FinButton from "../components/Shared/FinButton";
import PageTitle from "../components/Shared/Layout/PageTitle";
import {
  ChartValidationResult,
  useValidateBulkChartsMutation,
} from "../queries/bulkQueries";
import FinLoader from "../components/Shared/LoadingAndErrors/FinLoader";

const BulkValidate = () => {
  const [chartStrings, setChartStrings] = useState<string>("");
  const validateMutation = useValidateBulkChartsMutation();

  const handleValidate = () => {
    if (!chartStrings.trim()) {
      return;
    }

    validateMutation.mutate(chartStrings);
  };

  const getIconForResult = (result: ChartValidationResult) => {
    if (!result.isValid) {
      return (
        <Badge color="danger" pill={true}>
          Invalid
        </Badge>
      );
    }
    if (result.isWarning) {
      return (
        <Badge color="warning" pill={true}>
          Warning
        </Badge>
      );
    }
    return (
      <Badge color="success" pill={true}>
        Valid
      </Badge>
    );
  };

  return (
    <div className="main">
      <PageTitle title="Bulk Chart String Validation" />

      <div className="mb-3">
        <label htmlFor="chart-strings-input" className="form-label">
          <p>
            Paste in chart strings separated by commas, spaces, or newlines
            (maximum 200):
          </p>
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

      {validateMutation.isError && (
        <div className="alert alert-danger mt-3" role="alert">
          {validateMutation.error?.message ||
            "An error occurred during validation."}
        </div>
      )}

      {validateMutation.isSuccess && validateMutation.data && (
        <div className="mt-4">
          <h4>Validation Results</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Status</th>
                <th>Chart String</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {validateMutation.data.map((result, index) => (
                <tr key={index}>
                  <td>{getIconForResult(result)}</td>
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
