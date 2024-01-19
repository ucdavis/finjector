import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import CopyToClipboardHover from "../components/Shared/CopyToClipboardHover";
import CopyToClipboardButton from "../components/Shared/CopyToClipboardButton";
import PageTitle from "../components/Shared/StyledComponents/PageTitle";

const Selected = () => {
  const { chartSegmentString } = useParams();

  const [hasOpener, setHasOpener] = React.useState<boolean>(!!window.opener);

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        {
          source: "finjector",
          status: "success",
          data: chartSegmentString,
        },
        "*" // send to all, we don't know the origin
      );
      // message sent, close the window
      window.close();
    } else {
      setHasOpener(false);
    }
  }, [chartSegmentString]);

  if (chartSegmentString && !chartSegmentString.includes("-")) {
    // if we have a chart segment string, but it doesn't have a dash, it's probably a chart id
    return <Navigate to={`/locator/selected/${chartSegmentString}`} />;
  }

  return (
    <div>
      <PageTitle title="Chart String Selected" />
      <div>
        <CopyToClipboardHover value={chartSegmentString ?? ""} id="selected">
          <code>{chartSegmentString}</code>
        </CopyToClipboardHover>
      </div>
      {hasOpener ? (
        <p>Finjector will close this window shortly.</p>
      ) : (
        <div>
          <p>
            You've selected a chart string but aren't using Finjector inside a
            popup window.
          </p>
          <p>
            Click copy to copy this to your clipboard, or head back home to work
            with another chart string.
          </p>
          <CopyToClipboardButton
            value={chartSegmentString ?? ""}
            id="selected"
          />
        </div>
      )}
    </div>
  );
};

export default Selected;
