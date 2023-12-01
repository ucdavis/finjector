import React, { useState } from "react";
import { Input, InputGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import CopyToClipboard from "../../shared/CopyToClipboard";
import FinjectorButton from "./FinjectorButton";

interface SharePopupProps {
  chartString: string;
  teamId?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ chartString, teamId }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const url = `${window.location.origin}/details/${
    teamId ? teamId + "/" : ""
  }${chartString}`;

  return (
    <>
      <FinjectorButton onClick={toggle}>Share</FinjectorButton>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Share Chart String
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input value={url} />
            <CopyToClipboard value={url}>
              <FinjectorButton>Copy</FinjectorButton>
            </CopyToClipboard>
          </InputGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SharePopup;
