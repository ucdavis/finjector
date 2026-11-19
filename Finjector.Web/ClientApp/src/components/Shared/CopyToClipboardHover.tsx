import React from "react";
import { toast } from "react-toastify";

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
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard.", {
        role: "status",
        autoClose: 3000,
        icon: false,
      });
    } catch {
      toast.error("Copy failed. Check your browser’s clipboard permissions.", {
        role: "alert",
        icon: false,
      });
    }
  };

  return (
    <span className="copy-container-hover">
      {value ? (
        <button
          type="button"
          id={`copy-button-hover-${id}`}
          className="copy-value-button"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          <span className="visually-hidden">Copy </span>
          {children}
          <span className="visually-hidden"> to clipboard</span>
        </button>
      ) : children}
    </span>
  );
};

export default CopyToClipboardHover;
