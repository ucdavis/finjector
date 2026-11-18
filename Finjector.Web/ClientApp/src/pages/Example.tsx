import React from "react";
import FinButton from "../components/Shared/FinButton";

declare global {
  interface Window {
    Finjector: any;
  }
}

const Example: React.FC = () => {
  const [importedCharts, setImportedCharts] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState("");

  const openFinjector = async (e: any) => {
    e.preventDefault();

    const result = await window.Finjector.findChartSegmentString(
      window.location.origin
    );

    if (result.status === "success") {
      // stick the chart string in the input
      const input = document.getElementById("ccoa-input") as HTMLInputElement;

      input.value = result.data;
      setStatus("Full chart string updated.");
    }
  };

  const openFinjectorImport = async (e: any) => {
    e.preventDefault();

    const result = await window.Finjector.importBulkChartSegmentStrings(
      window.location.origin + "/import"
    );

    if (result.status === "success") {
      setImportedCharts(
        result.data.map((chart: any) => `${chart.name}: ${chart.chartString}`)
      );
      setStatus(`Imported ${result.data.length} chart strings.`);
    }
  };

  return (
    <div className="form-signin w-100 m-auto">
      <h1>For Example / Test Use Only</h1>
      <form onSubmit={openFinjector}>
        <h2 className="h3 mb-3 fw-normal">
          Please enter your account information
        </h2>

        <div className="input-group">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="ccoa-input"
              aria-describedby="ccoa-help"
              placeholder=" "
            />
            <label htmlFor="ccoa-input">Full Chart String</label>
          </div>
          <button
            type="button"
            onClick={openFinjector}
            className="btn btn-secondary"
            id="lookup"
          >
            Lookup
          </button>
        </div>
        <small id="ccoa-help" className="form-text text-muted">
          Enter a GL or PPM chart string. Example PPM account: K30APSD227-TASK01-APLS002-770000
        </small>

        <hr />
        <FinButton
          type="button"
          onClick={openFinjectorImport}
          className="btn btn-secondary"
          id="import"
        >
          Import
        </FinButton>

        <p role="status" className="visually-hidden">{status}</p>
        <ul>
          {importedCharts.map((chart, index) => (
            <li key={index}>{chart}</li>
          ))}
        </ul>

        <hr />
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Fake Submit
        </button>
      </form>
    </div>
  );
};

export default Example;
