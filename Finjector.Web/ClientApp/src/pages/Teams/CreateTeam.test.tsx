import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import CreateTeam from "./CreateTeam";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CreateTeam tests", () => {
  beforeEach(() => {
    render(wrappedView());
  });
  it("renders", () => {
    expect(screen.getAllByText("Create New Team")[0]).toBeInTheDocument();
  });
  it("renders the page title", () => {
    expect(
      screen.getByRole("heading", {
        name: /create new team/i,
      })
    ).toBeInTheDocument();
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
    expect(nameInput).toHaveValue("");
    expect(nameInput).toBeEnabled();
  });
  it("renders the description input field", () => {
    const descriptionInput = screen.getByRole("textbox", {
      name: /description:/i,
    });

    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue("");
    expect(descriptionInput).toBeEnabled();
  });

  it("renders the save button", () => {
    const saveButton = screen.getByRole("button", { name: /create new team/i });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/create`]}>
      <Routes>
        <Route path="/teams/create" element={<CreateTeam />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
