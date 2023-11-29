import React, { useEffect } from "react";
import {
  isGlSegmentString,
  isPpmSegmentString,
} from "../util/segmentValidation";

import { useNavigate } from "react-router-dom";
import FinjectorButton from "../components/Shared/FinjectorButton";
import { BackLinkBar } from "../components/Shared/BackLinkBar";

const Paste = () => {
  const navigate = useNavigate();

  const [coa, setCoa] = React.useState<string>("");

  const [error, setError] = React.useState<string>("");

  // when coa changes, validate it and show errors if any
  useEffect(() => {
    const coaValid = isGlSegmentString(coa) || isPpmSegmentString(coa);

    if (coaValid || coa === "") {
      setError("");
    } else {
      setError("CoA does not appear to be a valid GL or PPM segment string");
    }
  }, [coa]);

  return (
    <div className="main">
      <BackLinkBar />
      <h2>Paste in existing CoA</h2>
      <form>
        <div className="mb-3">
          <p>Paste in a copied account number</p>
          <input
            className="form-control"
            id="coa-input"
            value={coa}
            onChange={(e) => setCoa(e.target.value)}
            placeholder="ex: 1311-63031-9300531-508210-44-G29-CM00000039-510139-0000-000000-000000"
          ></input>
        </div>
      </form>
      {error && (
        <div className={`alert alert-danger`} role="alert">
          {error}
        </div>
      )}
      <div className="d-grid">
        <FinjectorButton
          className="btn btn-primary"
          disabled={error !== "" || coa === ""}
          onClick={() => navigate(`/entry/${coa}`)}
        >
          NEXT
        </FinjectorButton>
      </div>
    </div>
  );
};

export default Paste;
