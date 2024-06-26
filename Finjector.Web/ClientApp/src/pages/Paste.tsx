import React, { SyntheticEvent, useEffect } from "react";
import {
  isGlSegmentString,
  isPpmSegmentString,
  isPoetSegmentString,
} from "../util/segmentValidation";

import { useNavigate } from "react-router-dom";
import FinButton from "../components/Shared/FinButton";
import PageTitle from "../components/Shared/Layout/PageTitle";

const Paste = () => {
  const navigate = useNavigate();

  const [coa, setCoa] = React.useState<string>("");

  const [error, setError] = React.useState<string>("");

  // when coa changes, validate it and show errors if any
  useEffect(() => {
    const coaValid =
      isGlSegmentString(coa) ||
      isPpmSegmentString(coa) ||
      isPoetSegmentString(coa);

    if (coaValid || coa === "") {
      setError("");
    } else {
      setError(
        "Chart String does not appear to be a valid GL or PPM segment string"
      );
    }
  }, [coa]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (error === "" && coa !== "") {
      navigate(`/entry/${coa}`);
    }
  };

  return (
    <div className="main">
      <PageTitle title="New Chart String from paste" />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <p>Paste in a copied Chart String</p>
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
      {isPoetSegmentString(coa) && (
        <div className={`alert alert-info`} role="alert">
          This appears to be a POET segment string. We can try importing and
          converting it to a PPM string.
        </div>
      )}
      <div className="d-grid">
        <FinButton
          className="btn btn-primary"
          disabled={error !== "" || coa === ""}
          onClick={handleSubmit}
          margin={false}
        >
          NEXT
        </FinButton>
      </div>
    </div>
  );
};

export default Paste;
