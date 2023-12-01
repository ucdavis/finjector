import React from "react";

import { cleanupApiMocks, mockApi } from "../util/test";
import { fakeCharts } from "../util/mockData";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

afterAll(() => {
  cleanupApiMocks();
});

const mockSavedChartsCall = () => {
  mockApi().get("/api/charts/all").reply(200, fakeCharts);
};

// test main landing page
describe("Landing", () => {
  it("renders", () => {
    // setup mock
    mockSavedChartsCall();

    // render component
    render(wrappedView());

    // should see the create new chart buttons
    expect(
      screen.getByRole("link", { name: /New Chartstring from Scratch/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /New Chartstring from Paste/i })
    ).toBeInTheDocument();
  });

  it("loads saved charts", async () => {
    // setup mock
    mockSavedChartsCall();

    // render component
    render(wrappedView());

    // should see list of saved charts (3 from our mock data)
    await waitFor(() => {
      expect(screen.getByText("Chart 1")).toBeInTheDocument();
    });
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/`]}>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
