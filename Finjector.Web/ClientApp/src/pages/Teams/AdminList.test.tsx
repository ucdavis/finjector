import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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
      });
    });
    it("renders team name", async () => {
      await waitFor(() => {
        expect(screen.getByText("Team 1")).toBeInTheDocument();
      });
    });
    describe("renders table", () => {
      it("with expected column headings", async () => {
        await waitFor(() => {
          expect(screen.getByText("User Name")).toBeInTheDocument();
          expect(screen.getByText("User Email")).toBeInTheDocument();
          expect(screen.getByText("Level")).toBeInTheDocument();
          expect(screen.getByText("Role Name")).toBeInTheDocument();
        });
      });
      it("with expected user names", async () => {
        await waitFor(() => {
          expect(screen.getByText("User 0")).toBeInTheDocument();
          expect(screen.getByText("User 1")).toBeInTheDocument();
          expect(
            screen.getByRole("cell", {
              name: /user 1/i,
            })
          ).toBeInTheDocument(); //Example of using regex to find a cell
          expect(screen.getByText("User 2")).toBeInTheDocument();
          expect(screen.queryByText("User 3")).not.toBeInTheDocument();
          expect(screen.queryByText("User 4")).not.toBeInTheDocument();
        });
      });
      it("with expected user emails", async () => {
        await waitFor(() => {
          expect(screen.getByText("fake0@faker.com")).toBeInTheDocument();
          expect(screen.getByText("fake1@faker.com")).toBeInTheDocument();
          expect(screen.getByText("fake2@faker.com")).toBeInTheDocument();
          expect(screen.queryByText("fake3@faker.com")).not.toBeInTheDocument();
          expect(screen.queryByText("fake4@faker.com")).not.toBeInTheDocument();
        });
      });
      it("with expected expected role name data", async () => {
        await waitFor(() => {
          const roleNameCells = screen.getAllByRole("cell", {
            name: /admin/i,
          });
          expect(roleNameCells.length).toBe(3);
        });
      });

      it("with expected folder level (none)", async () => {
        await waitFor(() => {
          const levelCells = screen.queryAllByRole("cell", {
            name: /folder/i,
          });
          expect(levelCells.length).toBe(0);
        });
      });
      it("with expected team level", async () => {
        await waitFor(() => {
          const levelCells = screen.queryAllByRole("cell", {
            name: /team/i,
          });
          expect(levelCells.length).toBe(3);
        });
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
        expect(screen.getByText("Team 1 / Folder 1")).toBeInTheDocument();
      });
    });
    describe("renders table", () => {
      it("with expected column headings", async () => {
        await waitFor(() => {
          expect(screen.getByText("User Name")).toBeInTheDocument();
          expect(screen.getByText("User Email")).toBeInTheDocument();
          expect(screen.getByText("Level")).toBeInTheDocument();
          expect(screen.getByText("Role Name")).toBeInTheDocument();
        });
      });
      it("with expected user names", async () => {
        await waitFor(() => {
          expect(screen.getByText("User 0")).toBeInTheDocument();
          expect(screen.getByText("User 1")).toBeInTheDocument();
          expect(
            screen.getByRole("cell", {
              name: /user 1/i,
            })
          ).toBeInTheDocument(); //Example of using regex to find a cell
          expect(screen.getByText("User 2")).toBeInTheDocument();
          expect(screen.getByText("User 3")).toBeInTheDocument();
          expect(screen.queryByText("User 4")).not.toBeInTheDocument();
          expect(screen.queryByText("User 5")).not.toBeInTheDocument();
        });
      });
      it("with expected user emails", async () => {
        await waitFor(() => {
          expect(screen.getByText("fake0@faker.com")).toBeInTheDocument();
          expect(screen.getByText("fake1@faker.com")).toBeInTheDocument();
          expect(screen.getByText("fake2@faker.com")).toBeInTheDocument();
          expect(screen.queryByText("fake3@faker.com")).toBeInTheDocument();
          expect(screen.queryByText("fake4@faker.com")).not.toBeInTheDocument();
          expect(screen.queryByText("fake5@faker.com")).not.toBeInTheDocument();
        });
      });
      it("with expected expected role name data", async () => {
        await waitFor(() => {
          const roleNameCells = screen.getAllByRole("cell", {
            name: /admin/i,
          });
          expect(roleNameCells.length).toBe(4);
        });
      });

      it("with expected folder level", async () => {
        await waitFor(() => {
          const levelCells = screen.queryAllByRole("cell", {
            name: /folder/i,
          });
          expect(levelCells.length).toBe(3);
        });
      });
      it("with expected team level", async () => {
        await waitFor(() => {
          const levelCells = screen.queryAllByRole("cell", {
            name: /team/i,
          });
          expect(levelCells.length).toBe(1);
        });
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
