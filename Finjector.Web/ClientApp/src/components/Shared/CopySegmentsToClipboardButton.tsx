import React from "react";
import CopyToClipboardButton from "./CopyToClipboardButton";
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
  const text = [...segments]
    .sort((a, b) => a.order - b.order)
    .map((segment) => `*${segment.entity}*: ${segment.code} (${segment.name})`)
    .join("\n");

  return (
    <CopyToClipboardButton id={id} {...props} value={text}>
      {children ?? "Copy Details"}
    </CopyToClipboardButton>
  );
};

export default CopySegmentsToClipboardButton;
