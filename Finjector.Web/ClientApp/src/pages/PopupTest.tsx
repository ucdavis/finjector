import React from "react";

/* 
Launch /selection in a popup window to test functionality
*/

declare global {
  interface Window {
    Finjector: any;
  }
}

const PopupTest = () => {
  const openPopup = () => {
    window.Finjector.findChartSegmentString('/selection');
  };
  const openDevPopup = async () => {
    const chart = await window.Finjector.findChartSegmentString();

    console.log('awaited result', chart);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>F(inancial) Injector test page</p>
        <form>
          <input
            type="text"
            id="ccoa"
            name="ccoa"
            placeholder="Enter CCOA string"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
          <input type="button" value="Lookup" onClick={openPopup} />
          <input type="button" value="Dev Lookup" onClick={openDevPopup} />
        </form>
      </header>
    </div>
  );
};

export default PopupTest;
