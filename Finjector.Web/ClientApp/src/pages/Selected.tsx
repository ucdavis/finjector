import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CopyToClipboardHover from "../shared/CopyToClipboardHover";
import CopyToClipboardButton from "../shared/CopyToClipboardButton";

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

  return (
    <div>
      <div className="page-title mb-3">
        <h1>Chart Selected</h1>
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
            You've selected a chart but aren't using Finjector inside a popup
            window.
          </p>
          <p>
            Click copy to copy this to your clipboard, or head back home to work
            with another chart.
          </p>
          <CopyToClipboardButton value={chart ?? ""} id="selected" />
        </div>
      )}
    </div>
  );
};

export default Selected;
