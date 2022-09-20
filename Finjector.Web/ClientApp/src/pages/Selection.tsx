import React from "react";

/*
 * Page for selecting a CCOA string
 * This page is intended to be used inside a popup window
 * Once the user has selected a CCOA string, the popup window will close and the parent window will be updated with the selected CCOA string
 */

const Selection = () => {
  const onSubmit = (ccoa: string) => {
    const opener = window.opener as Window;

    if (opener) {
      const openerInput = opener.document.getElementById(
        "ccoa"
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
        <p>Your favorite CCOA strings</p>
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
