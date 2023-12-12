import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import CopyToClipboardHover from "../components/Shared/CopyToClipboardHover";
import CopyToClipboardButton from "../components/Shared/CopyToClipboardButton";

const Selected = () => {
  const { chart } = useParams();

  const [hasOpener, setHasOpener] = React.useState<boolean>(!!window.opener);

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        {
          source: "finjector",
          status: "success",
          data: chart,
        },
        "*" // send to all, we don't know the origin
      );

      // message sent, close the window
      window.close();
    } else {
      setHasOpener(false);
    }
  }, [chart]);
  
  if (chart && !chart.includes("-")) {
    // if we have a chart segment string, but it doesn't have a dash, it's probably a chart id
    return <Navigate to={`/locator/selected/${chart}`} />;
  }

  return (
    <div>
      <div className="page-title mb-3">
        <h1>Chart String Selected</h1>
      </div>

      <div>
        <CopyToClipboardHover value={chart ?? ""} id="selected">
          <code>{chart}</code>
        </CopyToClipboardHover>
      </div>
      {hasOpener ? (
        <p>Finjector will close this window shortly.</p>
      ) : (
        <div>
          <p>
            You've selected a chart string but aren't using Finjector inside a popup
            window.
          </p>
          <p>
            Click copy to copy this to your clipboard, or head back home to work
            with another chart string.
          </p>
          <CopyToClipboardButton value={chart ?? ""} id="selected" />
        </div>
      )}
    </div>
  );
};

export default Selected;
