import React, { useState } from "react";
import { UncontrolledTooltip } from "reactstrap";

interface CopyToClipboardProps {
  value: string;
  children: React.ReactNode;
  id?: string;
}

const copyToClipboardDefaultMessage = "copy to clipboard";

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  children,
  id,
}) => {
  const [titleText, setTitleText] = useState<string>(
    copyToClipboardDefaultMessage
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setTitleText("copied!");
      setTimeout(() => setTitleText(copyToClipboardDefaultMessage), 2000); // Reset title after 2 seconds
    });
  };

  return (
    <div id={`copy-container-${id}`}>
      <div
        id={`copy-button-${id}`}
        style={{
          cursor: "pointer",
        }}
        onClick={handleCopy}
      >
        {children}
      </div>

      <UncontrolledTooltip placement="top" target={`copy-button-${id}`}>
        {titleText}
      </UncontrolledTooltip>
    </div>
  );
};

export default CopyToClipboard;
