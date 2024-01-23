import React, { useState } from "react";
import { Input, InputGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import CopyToClipboardButton from "../Shared/CopyToClipboardButton";
import FinButton from "../Shared/FinButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface SharePopupProps {
  chartString: string;
  teamId?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ chartString, teamId }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const url = `${window.location.origin}/details/${chartString}`;

  return (
    <>
      <FinButton onClick={toggle}>
        <FontAwesomeIcon icon={faPaperPlane} />
        Share
      </FinButton>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader tag="h2" toggle={toggle}>
          Share Chart String
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
              className="custom-input-height"
              value={url}
              readOnly={true}
            />
            <CopyToClipboardButton value={url} id="share-copy-url" />
          </InputGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SharePopup;
