import React, { useState } from "react";
import FinButton from "./FinButton";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CopyToClipboardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children?: React.ReactNode;
  id: string;
  link?: boolean;
  compact?: boolean;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  value,
  children,
  id,
  link,
  compact = false,
  ...props
}) => {
  const [status, setStatus] = useState<"" | "copied" | "failed">("");

  const handleCopy = async () => {
    setStatus("");
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };
  const content = (
    <>
      <FontAwesomeIcon icon={status === "copied" ? faCheck : faCopy} />
      {!compact && (children ?? "Copy")}
    </>
  );

  return (
    <>
      {compact || link ? (
        <button
          type="button"
          id={`copy-button-${id}`}
          className={compact ? "copy-inline-button" : "btn btn-link"}
          onClick={handleCopy}
          {...props}
        >
          {content}
        </button>
      ) : (
        <FinButton id={`copy-button-${id}`} onClick={handleCopy} margin={false} {...props}>
          {content}
        </FinButton>
      )}
      <span role="status" className={status === "failed" ? "small" : "visually-hidden"}>
        {status === "copied" && "Copied to clipboard."}
        {status === "failed" && "Copy failed. Check your browser’s clipboard permissions."}
      </span>
    </>
  );
};

export default CopyToClipboardButton;
