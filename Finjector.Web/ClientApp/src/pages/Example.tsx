import React from "react";
import FinjectorButton from "../components/Shared/FinjectorButton";

declare global {
  interface Window {
    Finjector: any;
  }
}

const Example: React.FC = () => {
  const [importedCharts, setImportedCharts] = React.useState<string[]>([]);

  const openFinjector = async (e: any) => {
    e.preventDefault();

    const result = await window.Finjector.findChartSegmentString(
      window.location.origin
    );

    if (result.status === "success") {
      // stick the chart string in the input
      const input = document.getElementById("ccoa-input") as HTMLInputElement;

      input.value = result.data;
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
    }
  };

  return (
    <main className="form-signin w-100 m-auto">
      <h1>For Example / Test Use Only</h1>
      <form>
        <h1 className="h3 mb-3 fw-normal">
          Please enter your account information
        </h1>

        <div className="input-group">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="ccoa-input"
              placeholder="GL or PPM accepted"
            />
            <label htmlFor="floatingInput">Full Chart String</label>
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
          Example PPM account: K30APSD227-TASK01-APLS002-770000
        </small>

        <hr />
        <FinjectorButton
          type="button"
          onClick={openFinjectorImport}
          className="btn btn-secondary"
          id="import"
        >
          Import
        </FinjectorButton>

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
    </main>
  );
};

export default Example;
