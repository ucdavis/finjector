/* Inject as script tag in html to gain access to Finjector window object */
window.Finjector = {
  messageCallback: undefined,
};

// call this function to open popup to get bulk chart data (teams & folders)
window.Finjector.importBulkChartSegmentStrings = (url) => {
  const uri = new URL(url || "https://finjector.ucdavis.edu/import");

  return handlePopup(uri);
};

// call this function to open popup and get chart data
window.Finjector.findChartSegmentString = (url) => {
  const uri = new URL(url || "https://finjector.ucdavis.edu");

  return handlePopup(uri);
};

// common handler for popup windows
const handlePopup = (url) => {
  // only allow one callback to be active at a time
  if (window.Finjector.messageCallback) {
    window.removeEventListener("message", window.Finjector.messageCallback);
  }

  return new Promise((resolve, reject) => {
    const newWindow = popupCenter(url.href, "popup", 600, 800);

    const messageHandler = (event) => {
      if (event.origin !== url.origin) {
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

    window.Finjector.messageCallback = messageHandler;

    if (newWindow) {
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
