import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import CopyToClipboardButton from "../../shared/CopyToClipboardButton";
import FinjectorButton from "./FinjectorButton";

interface SharePopupProps {
  chartString: string;
  teamId?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ chartString, teamId }) => {
  const [modal, setModal] = useState(false);
  const location = useLocation();

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
            <CopyToClipboardButton value={chartString}>
              <FinjectorButton>Copy</FinjectorButton>
            </CopyToClipboardButton>
          </InputGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SharePopup;
