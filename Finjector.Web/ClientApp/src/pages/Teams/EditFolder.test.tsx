import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import EditFolder from "./EditFolder";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("EditFolder tests", () => {
  let teamNumber: string;
  let folderNumber: string;
  beforeEach(async () => {
    teamNumber = "1";
    folderNumber = "2";
    // render component
    render(wrappedView(teamNumber, folderNumber));
    await waitFor(() => {
      expect(screen.getByText(`Folder ${folderNumber}`)).toBeInTheDocument();
    });
  });

  it("renders", async () => {
    await waitFor(() => {
      expect(screen.getByText("Edit Folder")).toBeInTheDocument();
    });
  });
  it("renders the folder name", async () => {
    await waitFor(() => {
      expect(screen.getByText(`Folder ${folderNumber}`)).toBeInTheDocument();
    });
  });
  it("renders the folder description", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(`Folder ${folderNumber} description`)
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
    expect(nameInput).toHaveValue(`Folder ${folderNumber}`);
    expect(nameInput).toBeEnabled();
  });
  it("renders the description input field", () => {
    const descriptionInput = screen.getByRole("textbox", {
      name: /description:/i,
    });

    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue(`Folder ${folderNumber} description`);
    expect(descriptionInput).toBeEnabled();
  });

  it("renders the save button", () => {
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
  });
});

const wrappedView = (teamId: string, folderId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter
      initialEntries={[`/teams/${teamId}/folders/${folderId}/edit`]}
    >
      <Routes>
        <Route
          path="/teams/:teamId/folders/:folderId/edit"
          element={<EditFolder />}
        />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
