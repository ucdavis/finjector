/* Inject as script tag in html to gain access to Finjector window object */
window.Finjector = {};

// call this function to open popup and get chart data
window.Finjector.findChartSegmentString = (url) => {
  return new Promise((resolve, reject) => {
    const uri = new URL(url || "https://finjector.ucdavis.edu");

    const newWindow = popupCenter(uri.href, "popup", 600, 600);

    const messageHandler = (event) => {
      if (event.origin !== uri.origin) {
        return;
      }

      if (event.data.source === "finjector") {
        // go the data we want, so remove the listener and return the promise result
        window.removeEventListener("message", messageHandler);

        if (event.data.status === "success") {
          resolve(event.data);
        } else {
          reject(event.data);
        }
      }
    };

    if (newWindow) {
      // remove any existing listeners
      window.removeEventListener("message", messageHandler);

      // add a listener to get the data from the popup
      window.addEventListener("message", messageHandler, false);
    }
  });
};

// TODO: make helper so HTML clients can pass element ID and we'll auto attach a click handler to it

// https://stackoverflow.com/a/16861050
const popupCenter = (url, title, w, h) => {
  // Fixes dual-screen position
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

  return newWindow;
};
