import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
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

  //test that it renders the search/filter entry field
  it("renders search/filter", () => {
    // render component
    render(wrappedView());

    // should see the search/filter field
    expect(
      screen.getByPlaceholderText("Search my chart strings, teams and folders")
    ).toBeInTheDocument();
  });

  // test that it renders the title
  it("renders title", async () => {
    // render component
    render(wrappedView());

    // should see the title
    expect(
      screen.getByText("Scribbling in your Chart Strings...")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("My Chart Strings")).toBeInTheDocument();
    });
  });

  it("loads saved charts", async () => {
    // render component
    render(wrappedView());

    // should see list of saved charts (3 from our mock data)
    await waitFor(() => {
      expect(screen.getByText("Chart 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Team 0")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Folder 0")).toBeInTheDocument();
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
