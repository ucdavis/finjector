import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import CreateFolder from "./CreateFolder";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CreateFolder tests", () => {
  const teamId = "2";
  beforeEach(() => {
    render(wrappedView(teamId));
  });
  it("renders", async () => {
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /create new folder/i,
        })
      ).toBeInTheDocument();
      console.log(screen.debug(undefined, 10000));
    });
  });
  it("renders the team name", async () => {
    await waitFor(() => {
      expect(screen.getByText(`Team ${teamId}`)).toBeInTheDocument();
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
  it("renders the name input field", async () => {
    await waitFor(() => {
      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });

      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue("");
      expect(nameInput).toBeEnabled();
    });
  });
  it("renders the description input field", async () => {
    await waitFor(() => {
      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });

      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).toHaveValue("");
      expect(descriptionInput).toBeEnabled();
    });
  });
  it("renders the save button", async () => {
    await waitFor(() => {
      const saveButton = screen.getByRole("button", {
        name: /create new folder/i,
      });

      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();
    });
  });
});

const wrappedView = (teamId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/folders/create`]}>
      <Routes>
        <Route
          path="/teams/:teamId/folders/create"
          element={<CreateFolder />}
        />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);