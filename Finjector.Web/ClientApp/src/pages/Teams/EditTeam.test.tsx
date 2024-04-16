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
  });
  it("renders the team name", async () => {
    await waitFor(() => {
      expect(screen.getByText(`Team ${teamNumber}`)).toBeInTheDocument();
    });
  });
  it("renders the team description", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(`Team ${teamNumber} description`)
      ).toBeInTheDocument();
    });
  });
  it("renders the name label", async () => {
    await waitFor(() => {
      expect(screen.getByText(/name:/i)).toBeInTheDocument();
    });
  });
  it("renders the description label", async () => {
    await waitFor(() => {
      expect(screen.getByText(/description:/i)).toBeInTheDocument();
    });
  });
  it("renders the name input field", () => {
    const nameInput = screen.getByRole("textbox", {
      name: /name:/i,
    });

    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue(`Team ${teamNumber}`);
    expect(nameInput).toBeEnabled();
  });
  it("renders the description input field", () => {
    const descriptionInput = screen.getByRole("textbox", {
      name: /description:/i,
    });

    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue(`Team ${teamNumber} description`);
    expect(descriptionInput).toBeEnabled();
  });

  it("renders the save button", () => {
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
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
