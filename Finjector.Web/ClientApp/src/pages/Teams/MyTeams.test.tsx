import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import MyTeams from "./MyTeams";
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

    console.log(screen.debug());
  });

  it("renders teams", async () => {
    // render component
    render(wrappedView());

    await waitFor(() => {
      expect(screen.getByText("Team 1")).toBeInTheDocument();
      expect(screen.getByText("Team 0")).toBeInTheDocument();
      console.log(screen.debug(undefined, 20000));
      //console.log(prettyDOM(document.body, 20000));
    });
  });

  //   it("renders error state", () => {
  //     useGetMyTeams.mockReturnValue({
  //       isLoading: false,
  //       isError: true,
  //       data: null,
  //     });

  //     render(
  //       <MemoryRouter>
  //         <MyTeams />
  //       </MemoryRouter>
  //     );

  //     expect(screen.getByText("Error loading Teams")).toBeInTheDocument();
  //   });

  //   it("renders teams list", async () => {
  //     const teams = [
  //       { id: 1, name: "Team 1" },
  //       { id: 2, name: "Team 2" },
  //     ];

  //     useGetMyTeams.mockReturnValue({
  //       isLoading: false,
  //       isError: false,
  //       data: teams,
  //     });

  //     render(
  //       <MemoryRouter>
  //         <MyTeams />
  //       </MemoryRouter>
  //     );

  //     await waitFor(() => {
  //       expect(screen.getByText("My Teams")).toBeInTheDocument();
  //       expect(screen.getByText("Team 1")).toBeInTheDocument();
  //       expect(screen.getByText("Team 2")).toBeInTheDocument();
  //     });
  //   });

  //   it("filters teams list", async () => {
  //     const teams = [
  //       { id: 1, name: "Team 1" },
  //       { id: 2, name: "Team 2" },
  //     ];

  //     useGetMyTeams.mockReturnValue({
  //       isLoading: false,
  //       isError: false,
  //       data: teams,
  //     });

  //     render(
  //       <MemoryRouter>
  //         <MyTeams />
  //       </MemoryRouter>
  //     );

  //     const searchInput = screen.getByPlaceholderText("Search My Teams");

  //     // Type "Team 1" in the search input
  //     await waitFor(() => {
  //       userEvent.type(searchInput, "Team 1");
  //     });

  //     // Only "Team 1" should be visible
  //     expect(screen.getByText("Team 1")).toBeInTheDocument();
  //     expect(screen.queryByText("Team 2")).not.toBeInTheDocument();
  //   });
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
