import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../test/mocks/node";
import {
  fakeCharts,
  fakeInvalidChart,
  fakeValidAeDetails,
  fakeValidChart,
} from "../../test/mocks/mockData";
import Details from "./Details";

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

const testChart = fakeCharts[0];

// test main landing page
describe("Details", () => {
  it("renders", async () => {
    // render component
    render(wrappedView(testChart.segmentString));

    // make sure our test chart data is present
    await waitFor(() => {
      expect(screen.getByText(testChart.segmentString)).toBeInTheDocument();
    });
  });
  it("shows invalid chart", async () => {
    // render component
    render(wrappedView(fakeInvalidChart.segmentString));

    // should see invalid chart message
    await waitFor(() => {
      expect(
        screen.getByText(fakeInvalidChart.segmentString)
      ).toBeInTheDocument();
    });

    // should see invalid chart message
    await waitFor(() => {
      expect(
        screen.getByText("Error: GL segment fund (73830) does not exist.")
      ).toBeInTheDocument();
    });
  });
  it("shows valid chart", async () => {
    // render component
    render(wrappedView(fakeValidChart.segmentString));

    // should see valid chart message
    await waitFor(() => {
      expect(screen.getByText("Valid")).toBeInTheDocument();
    });
  });
  it("shows chart details", async () => {
    // render component
    render(wrappedView(fakeValidChart.segmentString));

    // should see valid chart message
    await waitFor(() => {
      expect(screen.getByText("Valid")).toBeInTheDocument();
    });

    // make sure the name and code of the first segment at least is present
    expect(
      screen.getByText(fakeValidAeDetails.segmentDetails[0].code || "")
    ).toBeInTheDocument();

    expect(
      screen.getByText(fakeValidAeDetails.segmentDetails[0].name || "")
    ).toBeInTheDocument();
  });
});

const wrappedView = (segmentString: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/details/${segmentString}`]}>
      <Routes>
        <Route path="/details/:chartSegmentString" element={<Details />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
