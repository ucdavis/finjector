import { Chart, ChartType } from "../types";

const fakeCharts: Chart[] = [];

// make 3 fake charts
for (let i = 0; i < 3; i++) {
  fakeCharts.push({
    id: i,
    name: `Chart ${i}`,
    segmentString: '3110-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000',
    chartType: ChartType.GL,
    folderId: 0,
    updated: new Date(),
  });
}

export { fakeCharts };
