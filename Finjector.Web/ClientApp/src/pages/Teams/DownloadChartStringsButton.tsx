import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

import FinButton from '../../components/Shared/FinButton';
import {
  ChartType,
  Coa,
  GlSegments,
  PpmSegments,
  SegmentData,
} from '../../types';
import {
  fromGlSegmentString,
  fromPpmSegmentString,
  glSegmentDefaults,
  ppmSegmentDefaults,
} from '../../util/segmentValidation';

interface DownloadChartStringsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  charts: Coa[];
  fileName: string;
  children?: React.ReactNode;
  fileType: 'CSV' | 'XLSX';
  borderless?: boolean;
  id: string;
}

const DownloadChartStringsButton: React.FC<DownloadChartStringsProps> = ({
  charts,
  fileName,
  fileType,
  borderless,
  children,
  id,
  ...props
}) => {
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);

  const handleDownload = () => {
    // we need to have some charts to download
    if (charts.length === 0) {
      return;
    }

    if (fileType === 'CSV') {
      downloadAsCSV();
    } else {
      throw new Error('Unsupported file type');
    }
  };

  const onHover = () => {
    setHasDownloaded(false);
  };

  const downloadAsCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    // sort by name
    const sortedCharts = [...charts].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    // add header row
    // columns are name, chartstring, type, and then the segments
    csvContent += 'name,chartstring,type,';

    const glSegments = glSegmentDefaults;
    const ppmSegments = ppmSegmentDefaults;

    // Add segment headers
    csvContent += Object.keys(glSegments).join(',');
    csvContent += ',';
    csvContent += Object.keys(ppmSegments).join(',');
    csvContent += '\r\n';

    // add rows
    sortedCharts.forEach((chart) => {
      const chartNameNoCommas = chart.name.replace(/,/g, '');

      // add the rows in common
      csvContent += `${chartNameNoCommas},${chart.segmentString},${chart.chartType},`;

      // now for each type we parse the segments and then go through adding the codes for each where they match the headers
      // we just add blanks for the other type, ex: GL chart has empty ppm columns
      if (chart.chartType === ChartType.GL) {
        const glChart = fromGlSegmentString(chart.segmentString);

        // go through each glSegments key and add the code
        csvContent += Object.keys(glSegments)
          .map((key) => {
            const segment: SegmentData = glChart[key as keyof GlSegments];
            if (segment) {
              return segment.code;
            } else {
              return '';
            }
          })
          .join(',');

        csvContent += ',';

        // just add empty ppm columns
        csvContent += Object.keys(ppmSegments)
          .map(() => '')
          .join(',');
        csvContent += '\r\n';
        return;
      } else if (chart.chartType === ChartType.PPM) {
        const ppmChart = fromPpmSegmentString(chart.segmentString);

        csvContent += Object.keys(glSegments)
          .map(() => '')
          .join(',');

        csvContent += ',';

        // go through each glSegments key and add the code
        csvContent += Object.keys(ppmSegments).map((key) => {
          const segment: SegmentData = ppmChart[key as keyof PpmSegments];
          if (segment) {
            return segment.code;
          } else {
            return '';
          }
        });

        csvContent += '\r\n';
        return;
      }
    });

    // Create a link and download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${fileName}.${fileType.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setHasDownloaded(true);
  };

  return (
    <FinButton
      id={`export-button-${id}`}
      onClick={handleDownload}
      onMouseEnter={onHover}
      borderless={borderless}
      margin={true}
      {...props}
    >
      <FontAwesomeIcon icon={faFile} />
      {children ??
        (hasDownloaded ? 'Exported!' : `Export Chart Strings (${fileType})`)}
    </FinButton>
  );
};

export default DownloadChartStringsButton;
