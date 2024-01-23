import React, { useState } from "react";
import FinjectorButton from "./FinjectorButton";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SegmentDetails } from "../../types";

interface DownloadSegmentsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  segments: SegmentDetails[];
  children?: React.ReactNode;
  fileType: "CSV" | "XLSX";
  id: string;
}

const DownloadSegmentsButton: React.FC<DownloadSegmentsButtonProps> = ({
  segments,
  fileType,
  children,
  id,
  ...props
}) => {
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);

  const handleDownload = () => {
    // we need to have segments to download
    if (segments.length === 0) {
      return;
    }

    if (fileType === "CSV") {
      downloadAsCSV();
    } else {
      throw new Error("Unsupported file type");
    }
  };

  const onHover = () => {
    setHasDownloaded(false);
  };

  const downloadAsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // first pull the string from the segments
    const sortedSegmentDetails = [...segments].sort(
      (a, b) => a.order - b.order
    );

    // remove the order property
    sortedSegmentDetails.forEach((segment) => {
      delete (segment as { order?: any }).order;
    });

    // add header row
    csvContent += Object.keys(sortedSegmentDetails[0]).join(",") + "\r\n";

    // Add data rows
    sortedSegmentDetails.forEach((row) => {
      const rowData = Object.values(row).join(",");
      csvContent += rowData + "\r\n";
    });

    // Create a link and download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ae_chartstring.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setHasDownloaded(true);
  };

  return (
    <FinjectorButton
      id={`download-button-${id}`}
      onClick={handleDownload}
      onMouseEnter={onHover}
      margin={true}
      {...props}
    >
      <FontAwesomeIcon icon={faFile} />
      {children ?? (hasDownloaded ? "Downloaded!" : `Download as ${fileType}`)}
    </FinjectorButton>
  );
};

export default DownloadSegmentsButton;
