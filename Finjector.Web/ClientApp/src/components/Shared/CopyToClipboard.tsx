import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { UncontrolledTooltip } from "reactstrap";

interface CopyToClipboardProps {
  value: string;
  children: React.ReactNode;
}

const copyToClipboardDefaultMessage = "copy to clipboard";

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  children,
}) => {
  const [titleText, setTitleText] = useState<string>(
    copyToClipboardDefaultMessage
  );
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setTitleText("copied!");
      setTimeout(() => setTitleText(copyToClipboardDefaultMessage), 2000); // Reset title after 2 seconds
    });
  };

  return (
    <div
      id="copy-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        id="copy-item-container"
        style={{ position: "relative", display: "inline-flex" }}
      >
        {children}
        <div
          id="copy-button"
          style={{
            position: "absolute",
            right: "-25px",
            top: 0,
            cursor: "pointer",
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
          }}
          onClick={handleCopy}
        >
          <FontAwesomeIcon icon={faCopy} />
        </div>
      </div>
      <UncontrolledTooltip placement="top" target="copy-button">
        {titleText}
      </UncontrolledTooltip>
    </div>
  );
};

export default CopyToClipboard;
