import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CopyToClipboard from "../components/Shared/CopyToClipboard";
import FinjectorButton from "../components/Shared/FinjectorButton";
import { BackLinkBar } from "../components/Shared/BackLinkBar";

const Selected = () => {
  const { chart } = useParams();

  const [hasOpener, setHasOpener] = React.useState<boolean>(!!window.opener);
  const [hasCopied, setHasCopied] = React.useState<boolean>(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chart || "").then(() => {
      setHasCopied(true);
    });
  };

  return (
    <div>
      <BackLinkBar />
      <div className="page-title mb-3">
        <h1>Chart Selected</h1>
      </div>

      <div>
        <CopyToClipboard value={chart || ""}>
          <code>{chart}</code>
        </CopyToClipboard>
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
          <FinjectorButton
            className="btn btn-primary"
            onClick={copyToClipboard}
          >
            {hasCopied ? "Copied!" : "Copy"}
          </FinjectorButton>
        </div>
      )}
    </div>
  );
};

export default Selected;
