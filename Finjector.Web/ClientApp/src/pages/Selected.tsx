import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Selected = () => {
  const { chart } = useParams();

  const [error, setError] = React.useState<string>();

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        {
          source: "finjector",
          status: "success",
          data: chart,
        },
        window.opener.origin // only send to the origin that opened the window
      );

      // message sent, close the window
      window.close();
    } else {
      setError("No opener window");
    }
  }, [chart]);

  return (
    <div>
      <h1>Selected {chart}</h1>
      <p>Temp page as popup communicates result.  Should only see if there is an error or setup issue.</p>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Selected;
