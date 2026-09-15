import React, { SyntheticEvent, useEffect } from "react";
import {
  isGlSegmentString,
  isPpmSegmentString,
  isPoetSegmentString,
  isPpmProjectNumber,
} from "../util/segmentValidation";

import { useNavigate } from "react-router-dom";
import FinButton from "../components/Shared/FinButton";
import PageTitle from "../components/Shared/Layout/PageTitle";

const Paste = () => {
  const navigate = useNavigate();

  const [coa, setCoa] = React.useState<string>("");
  const value = coa.trim();
  const projectOnly = isPpmProjectNumber(value);

  const [error, setError] = React.useState<string>("");

  // when coa changes, validate it and show errors if any
  useEffect(() => {
    const coaValid =
      isGlSegmentString(value) ||
      isPpmSegmentString(value) ||
      isPoetSegmentString(value) ||
      projectOnly;

    if (coaValid || value === "") {
      setError("");
    } else {
      setError(
        "Enter a valid GL or PPM chart string, or a 10-character PPM project number"
      );
    }
  }, [value, projectOnly]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (error === "" && value !== "") {
      navigate(
        projectOnly
          ? `/entry?project=${encodeURIComponent(value.toUpperCase())}`
          : `/entry/${encodeURIComponent(value)}`
      );
    }
  };

  return (
    <div className="main">
      <PageTitle title="New Chart String from paste" />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="coa-input">
            Paste in a copied Chart String or PPM project number
          </label>
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
      {isPoetSegmentString(value) && (
        <div className={`alert alert-info`} role="alert">
          This appears to be a POET segment string. We can try importing and
          converting it to a PPM string.
        </div>
      )}
      <div className="d-grid">
        <FinButton
          className="btn btn-primary"
          disabled={error !== "" || value === ""}
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
