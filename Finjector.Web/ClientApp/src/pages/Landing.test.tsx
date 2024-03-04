import React from "react";

import { fakeFolders, fakeTeams } from "../../test/mocks/mockData";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TeamGroupedCoas } from "../types";
import { vi, describe, it, expect } from "vitest";
import { server } from "../../test/mocks/node";

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

// test main landing page
describe("Landing", () => {
  it("renders", () => {
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
