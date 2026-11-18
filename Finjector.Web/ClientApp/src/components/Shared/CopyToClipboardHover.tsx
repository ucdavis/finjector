import React from "react";
import CopyToClipboardButton from "./CopyToClipboardButton";

interface CopyToClipboardProps {
  value: string;
  children: React.ReactNode;
  id: string;
}

const CopyToClipboardHover: React.FC<CopyToClipboardProps> = ({
  value,
  children,
  id,
}) => {
  return (
    <span className="copy-container-hover">
      {children}
      {value && (
        <CopyToClipboardButton
          id={`hover-${id}`}
          compact
          value={value}
          aria-label={`Copy ${value} to clipboard`}
          title="Copy to clipboard"
        />
      )}
    </span>
  );
};

export default CopyToClipboardHover;
