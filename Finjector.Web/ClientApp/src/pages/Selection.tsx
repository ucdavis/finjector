import React from "react";
import { useLocation } from "react-router-dom";

/*
 * Page for selecting a CCOA string
 * This page is intended to be used inside a popup window
 * Once the user has selected a CCOA string, the popup window will close and the parent window will be updated with the selected CCOA string
 */

const Selection = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const el = searchParams.get("el"); // passed in element id to update

  const hasError = window.opener == null || el == null;

  const onSubmit = (ccoa: string) => {
    const opener = window.opener as Window;

    if (opener) {
      const openerInput = opener.document.getElementById(
        el || ""
      ) as HTMLInputElement;

      if (openerInput) {
        openerInput.value = ccoa;
      }
    }

    window.close();
  };

  return (
    <div>
      <h1>Selection</h1>
      <div>
        {hasError && (
          <div className="alert alert-danger" role="alert">
            This page has not been configured correctly. Please read the docs.
          </div>
        )}
        <div className="card" style={{ width: "50%" }}>
          <div className="card-body">
            <h5 className="card-title">Dobalina Lab</h5>
            <p className="card-text">
              Primary PPM account for the Dobalina Lab
            </p>
            <button
              className="btn btn-primary"
              onClick={() => onSubmit("FPARE01802-IA1001-ADNO006-770003")}
              value="Dobalina Lab"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;
