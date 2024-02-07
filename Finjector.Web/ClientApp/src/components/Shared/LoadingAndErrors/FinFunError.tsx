import {
  faFaceKissBeam,
  faFaceSmile,
  faFlushed,
  faFrownOpen,
  faGrinBeamSweat,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCrown,
  faFrog,
  faHatWizard,
  faPoo,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const FinFunError: React.FC = () => {
  return (
    <div>
      <h2>Uh oh, that wasn't supposed to happen!</h2>
      <p>
        Congratulations, you found an error that isn't supposed to happen. Lucky
        you! Here's a magic trick as your reward:
      </p>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faHatWizard} size="3x" />
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faFaceSmile} size="3x" />
        </div>
        <div className="col-1">
          <FontAwesomeIcon icon={faWandSparkles} size="3x" />
        </div>
        <div className="col-1">
          <FontAwesomeIcon icon={faFrog} size="3x" />
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faHatWizard} size="3x" />
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faFrownOpen} size="3x" />
        </div>
        <div className="col-1">
          <FontAwesomeIcon icon={faWandSparkles} size="3x" />
        </div>
        <div className="col-1">
          <FontAwesomeIcon icon={faPoo} size="3x" />
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faHatWizard} size="3x" />
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faFlushed} size="3x" />
        </div>
        <div className="col-1"></div>
        <div className="col-1">
          <FontAwesomeIcon icon={faPoo} size="3x" />
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faHatWizard} size="3x" />
        </div>
        <div className="col-1"></div>
        <div className="col-1">
          <FontAwesomeIcon icon={faCrown} size="3x" />
        </div>
      </div>
      <div className="row">
        <div className="col-1">
          <FontAwesomeIcon icon={faGrinBeamSweat} size="3x" />
        </div>
        <div className="col-1">
          <FontAwesomeIcon icon={faWandSparkles} size="3x" />
        </div>
        <div className="col-1">
          <FontAwesomeIcon icon={faFaceKissBeam} size="3x" />
        </div>
      </div>
    </div>
  );
};

export default FinFunError;
