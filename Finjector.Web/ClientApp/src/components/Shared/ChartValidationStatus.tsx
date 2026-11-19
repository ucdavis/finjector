import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  faQuestion,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const statusIcons = {
  Valid: faCheck,
  Invalid: faBan,
  Warning: faTriangleExclamation,
  Unknown: faQuestion,
  "Loading...": faSpinner,
};

export type ChartValidationState = keyof typeof statusIcons;

const ChartValidationStatus = ({
  status,
}: {
  status: ChartValidationState;
}) => (
  <span
    className={`chartstring-type chart-validation-status text-nowrap ${
      status === "Valid" ? "is-valid" : status === "Invalid" ? "is-invalid" : ""
    }`}
  >
    <FontAwesomeIcon icon={statusIcons[status]} aria-hidden="true" /> {status}
  </span>
);

export default ChartValidationStatus;
