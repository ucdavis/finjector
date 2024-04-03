import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import MyTeams from "./MyTeams";
import userEvent from "@testing-library/user-event";
//import { fakeTeams, fakeFolders } from "../../../test/mocks/mockData";

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("MyTeams", () => {
  it("renders", async () => {
    // render component
    render(wrappedView());

    expect(
      screen.getByRole("link", { name: /Create New Team/i })
    ).toBeInTheDocument();
  });

  it("renders loading", async () => {
    // render component
    render(wrappedView());
    expect(
      screen.queryByText("Scribbling in Your Teams...")
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /Create New Team/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("My Teams")).toBeInTheDocument();
    });

    expect(
      screen.queryByText("Scribbling in Your Teams...")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders search box", async () => {
    // render component
    render(wrappedView());

    const searchField = screen.getByRole("searchbox");
    expect(searchField).toBeInTheDocument();
    expect(searchField).toHaveAttribute("placeholder", "Search My Teams");
  });

  it("renders title", async () => {
    // render component
    render(wrappedView());

    await waitFor(() => {
      expect(screen.getByText("My Teams")).toBeInTheDocument();
    });
  });

  it("renders teams", async () => {
    // render component
    render(wrappedView());

    await waitFor(() => {
      expect(screen.getByText("Team 1")).toBeInTheDocument();
      expect(screen.getByText("Team 0")).toBeInTheDocument();
      expect(screen.getAllByText("Go to Team").length).toBe(2);
      //console.log(screen.debug(undefined, 20000));
    });
  });

  it("renders teams links", async () => {
    // render component
    render(wrappedView());

    await waitFor(() => {
      const teamLinks = screen.getAllByRole("link", { name: /Go to Team/i });
      expect(teamLinks[0]).toHaveAttribute("href", "/teams/1");
      expect(teamLinks[1]).toHaveAttribute("href", "/teams/0");
    });
  });

  it("filters teams list", async () => {
    const user = userEvent.setup();
    // render component
    render(wrappedView());

    // Check for existing teams before filtering
    await waitFor(() => {
      expect(screen.getByText("Team 1")).toBeInTheDocument();
      expect(screen.getByText("Team 0")).toBeInTheDocument();
      expect(screen.getAllByText("Go to Team").length).toBe(2);
    });

    // search for a chart
    const searchField = screen.getByRole("searchbox");
    //type text into the search field
    await user.type(searchField, "Team 0");
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams`]}>
      <Routes>
        <Route path="/teams" element={<MyTeams />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
