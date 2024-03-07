import { ChartData, ChartType } from '../types';
import { GlSegments, PpmSegments } from '../types';

// only GL validation returns segment names, otherwise we just use segment codes
export const mapSegmentQueryData = (
  chartType: ChartType,
  chartData: ChartData,
  queryData: any,
) => {
  if (chartType === ChartType.PPM) {
    const segmentMap = queryData.validateResponse.segments;

    Object.keys(chartData.ppmSegments).forEach((segmentKey: string) => {
      const segment = (chartData.ppmSegments as any)[segmentKey];
      const mapValue = segmentMap[segmentKey];

      if (mapValue) {
        segment.name = mapValue;
        segment.isValid = true;
      }
    });
  } else if (chartType === ChartType.GL) {
    const segmentMap = queryData.validateResponse.segmentNames;

    Object.keys(chartData.glSegments).forEach((segmentKey: string) => {
      const segment = (chartData.glSegments as any)[segmentKey];
      const mapValue = segmentMap[segmentKey + 'Name'];

      if (mapValue) {
        segment.name = mapValue;
        segment.isValid = true;
      }
    });
  }
};

export const mapSegmentCodeToName = <T extends GlSegments | PpmSegments>(
  segments: T,
): T => {
  Object.keys(segments).forEach((segmentKey: string) => {
    const segment = (segments as any)[segmentKey];
    segment.name = segment.code;
  });

  return segments;
};
