import React from "react";

/* 
Launch /selection in a popup window to test functionality
*/

// We can optionally include this function in a helper file, but it's not necessary

// https://stackoverflow.com/a/16861050
const popupCenter = (url: string, title: string, w: number, h: number) => {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : window.screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : window.screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
  );

  newWindow?.focus();
};

const PopupTest = () => {
  const openPopup = () => {
    popupCenter("/selection?el=ccoa", "popup", 600, 600);
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
          />
          <input type="button" value="Lookup" onClick={openPopup} />
        </form>
      </header>
    </div>
  );
};

export default PopupTest;
