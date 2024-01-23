import React, { useState } from "react";
import { Input, InputGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import CopyToClipboardButton from "./CopyToClipboardButton";
import FinjectorButton from "./FinjectorButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { SegmentDetails } from "../../types";
import CopySegmentsToClipboardButton from "./CopySegmentsToClipboardButton";
import DownloadSegmentsButton from "./DownloadSegmentsButton";

interface SharePopupProps {
  chartString: string;
  segmentDetails: SegmentDetails[];
  teamId?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({
  chartString,
  segmentDetails,
}) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const url = `${window.location.origin}/details/${chartString}`;

  const downloadAsCSV = () => {
    // Logic to download table data as CSV
  };

  return (
    <>
      <FinjectorButton onClick={toggle}>
        <FontAwesomeIcon icon={faPaperPlane} />
        Share
      </FinjectorButton>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader tag="h2" toggle={toggle}>
          Share Chart String
        </ModalHeader>
        <ModalBody>
          <p>
            This link will share details about the chart string. The recipient
            does not need access to your team or folder to view the detailed
            information.
          </p>
          <InputGroup>
            <Input
              className="custom-input-height"
              value={url}
              readOnly={true}
            />
            <CopyToClipboardButton value={url} id="share-copy-url" />
          </InputGroup>

          <hr />
          <p>
            You can also copy the chart string details to your clipboard or
            download it as a CSV file.
          </p>
          <CopySegmentsToClipboardButton
            segments={segmentDetails}
            id="share-copy-details"
          />
          <DownloadSegmentsButton
            segments={segmentDetails}
            fileType="CSV"
            id="share-download-details"
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default SharePopup;
