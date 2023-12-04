import React, { useState } from "react";
import { Input, InputGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import CopyToClipboard from "../../shared/CopyToClipboard";
import FinjectorButton from "./FinjectorButton";

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
      <FinjectorButton onClick={toggle}>
        <FontAwesomeIcon icon={faPaperPlane} />
        Share
      </FinjectorButton>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader tag="h2" toggle={toggle}>
          Share Chart String
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input value={url} readOnly={true} />
            <CopyToClipboard value={url} id="share-copy-url">
              <FinjectorButton>Copy</FinjectorButton>
            </CopyToClipboard>
          </InputGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SharePopup;
