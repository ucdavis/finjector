import React from "react";

import { cleanupApiMocks, mockApi } from "../util/test";
import { fakeFolders, fakeTeams } from "../util/mockData";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TeamGroupedCoas } from "../types";
import { vi, describe, it, expect } from "vitest";

afterAll(() => {
  cleanupApiMocks();
});

const mockSavedChartsCall = () => {
  const fakeTeamGroups: TeamGroupedCoas[] = [
    {
      team: fakeTeams[0],
      folders: [fakeFolders[0]],
    },
  ];
  mockApi().get("/api/charts/all").reply(200, fakeTeamGroups);
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
      screen.getByRole("link", { name: /New Chart String from Scratch/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /New Chart String from Paste/i })
    ).toBeInTheDocument();
  });

  it("loads saved charts", async () => {
    // setup mock
    mockSavedChartsCall();

    // render component
    render(wrappedView());

    // should see list of saved charts (3 from our mock data)
    await vi.waitFor(() => {
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
