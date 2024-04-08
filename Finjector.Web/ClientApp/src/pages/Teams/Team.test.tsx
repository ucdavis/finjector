import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import Team from "./Team";
import userEvent from "@testing-library/user-event";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Team", () => {
  it("renders", async () => {
    // render component
    render(wrappedView("99"));

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
    console.log(screen.debug(undefined, 20000));
  });
  it("renders search box", async () => {
    // render component
    render(wrappedView("99"));
    await waitFor(() => {
      const searchField = screen.getByRole("searchbox");
      expect(searchField).toBeInTheDocument();
      expect(searchField).toHaveAttribute("placeholder", "Search Within Team"); //This should say, "Search Within Personal"
    });
    console.log(screen.debug(undefined, 20000));
  });
});

const wrappedView = (teamId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}`]}>
      <Routes>
        <Route path="/teams/:id" element={<Team />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
