import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import AdminList from "./AdminList";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("AdminList tests", () => {
  describe("Team AdminList tests", () => {
    const teamId = "1";

    beforeEach(async () => {
      render(teamWrappedView(teamId));
      await waitFor(() => {
        expect(screen.getByText("View Admins")).toBeInTheDocument();
      });
    });

    it("renders", async () => {
      await waitFor(() => {
        expect(screen.getByText("View Admins")).toBeInTheDocument();
        console.log(screen.debug(undefined, 200000));
      });
    });
    it("renders team name", async () => {
      await waitFor(() => {
        expect(screen.getByText("Team 1")).toBeInTheDocument();
      });
    });
  });
  describe("Folder AdminList tests", () => {
    const teamId = "1";
    const folderId = "2";
    beforeEach(async () => {
      render(folderWrappedView(teamId, folderId));
      await waitFor(() => {
        expect(screen.getByText("View Admins")).toBeInTheDocument();
      });
    });
    it("renders", async () => {
      await waitFor(() => {
        expect(screen.getByText("View Admins")).toBeInTheDocument();
      });
    });
    it("renders folder name", async () => {
      await waitFor(() => {
        expect(screen.getByText("Folder 1")).toBeInTheDocument();
      });
    });
  });
});
const teamWrappedView = (teamId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/admins`]}>
      <Routes>
        <Route path="/teams/:teamId/admins" element={<AdminList />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

const folderWrappedView = (teamId: string, folderId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter
      initialEntries={[`/teams/${teamId}/folders/${folderId}/admins`]}
    >
      <Routes>
        <Route
          path="/teams/:teamId/folders/:folderId/admins"
          element={<AdminList />}
        />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
