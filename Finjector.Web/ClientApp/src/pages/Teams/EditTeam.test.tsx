import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import EditTeam from "./EditTeam";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("EditTeam tests", () => {
  let teamNumber: string;
  beforeEach(async () => {
    teamNumber = "1";
    // render component
    render(wrappedView(teamNumber));
    await waitFor(() => {
      expect(screen.getByText(`Team ${teamNumber}`)).toBeInTheDocument();
    });
  });

  it("renders", async () => {
    await waitFor(() => {
      expect(screen.getByText("Edit Team")).toBeInTheDocument();
    });
    console.log(screen.debug(undefined, 100000));
  });
});

const wrappedView = (teamId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/edit`]}>
      <Routes>
        <Route path="/teams/:teamId/edit" element={<EditTeam />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
