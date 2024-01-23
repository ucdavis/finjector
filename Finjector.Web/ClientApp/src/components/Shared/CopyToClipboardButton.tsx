import React, { useState } from "react";
import FinButton from "./FinButton";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CopyToClipboardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children?: React.ReactNode;
  id: string;
  link?: boolean;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  value,
  children,
  id,
  link,
  ...props
}) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setHasCopied(true);
    });
  };

  const onHover = () => {
    setHasCopied(false);
  };

  if (link) {
    return (
      <div id={`copy-container-${id}`}>
        <div
          className="btn btn-link"
          id={`copy-button-${id}`}
          style={{
            cursor: "pointer",
          }}
          onClick={handleCopy}
          onMouseEnter={onHover}
        >
          <FontAwesomeIcon icon={faCopy} />
          {children ?? (hasCopied ? "Copied!" : "Copy")}
        </div>
      </div>
    );
  }

  return (
    <FinButton
      id={`copy-button-${id}`}
      onClick={handleCopy}
      onMouseEnter={onHover}
      margin={false}
      {...props}
    >
      <FontAwesomeIcon icon={faCopy} />
      {children ?? (hasCopied ? "Copied!" : "Copy")}
    </FinButton>
  );
};

export default CopyToClipboardButton;
