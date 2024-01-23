import React, { useState } from "react";
import FinjectorButton from "./FinjectorButton";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SegmentDetails } from "../../types";

interface CopySegmentsToClipboardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  segments: SegmentDetails[];
  children?: React.ReactNode;
  id: string;
}

const CopySegmentsToClipboardButton: React.FC<
  CopySegmentsToClipboardButtonProps
> = ({ segments, children, id, ...props }) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handleCopy = () => {
    // first pull the string from the segments
    const sortedSegmentDetails = [...segments].sort(
      (a, b) => a.order - b.order
    );

    // Transform each object into a string and combine all the strings
    const str = sortedSegmentDetails
      .map((segment) => `${segment.entity}: ${segment.code} (${segment.name})`)
      .join("\n");

    navigator.clipboard.writeText(str).then(() => {
      setHasCopied(true);
    });
  };

  const onHover = () => {
    setHasCopied(false);
  };

  return (
    <FinjectorButton
      id={`copy-button-${id}`}
      onClick={handleCopy}
      onMouseEnter={onHover}
      margin={true}
      {...props}
    >
      <FontAwesomeIcon icon={faCopy} />
      {children ?? (hasCopied ? "Copied!" : "Copy Details")}
    </FinjectorButton>
  );
};

export default CopySegmentsToClipboardButton;
