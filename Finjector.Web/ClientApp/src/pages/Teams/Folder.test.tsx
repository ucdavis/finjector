import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import Folder from "./Folder";
import userEvent from "@testing-library/user-event";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Folder", () => {
  describe("when team is personal and folder is Default", () => {
    it("renders", async () => {
      // render component
      render(wrappedView("99", "99"));

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      //console.log(screen.debug(undefined, 20000));
    });

    it("renders the team name", async () => {
      // render component
      render(wrappedView("99", "99"));

      await waitFor(() => {
        expect(screen.getByText("Personal")).toBeInTheDocument();
      });
    });

    it("renders the folder name", async () => {
      // render component
      render(wrappedView("99", "99"));

      await waitFor(() => {
        expect(screen.getByText("Default")).toBeInTheDocument();
      });
    });

    it("renders the actions button", async () => {
      // render component
      render(wrappedView("99", "99"));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /actions/i })
        ).toBeInTheDocument();
      });
    });
    it("renders the new chart string here button", async () => {
      const user = userEvent.setup();
      // render component
      render(wrappedView("99", "99"));

      const button = screen.getByRole("button", { name: /actions/i });

      user.click(button);

      await waitFor(() => {
        const link = screen.getByRole("link", {
          name: /New Chart String Here/i,
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/teams/99/folders/99/entry");
      });
    });
    it("renders the export button", async () => {
      const user = userEvent.setup();
      // render component
      render(wrappedView("99", "99"));

      const button = screen.getByRole("button", { name: /actions/i });

      user.click(button);

      await waitFor(() => {
        const link = screen.getByRole("button", {
          name: /export chart strings \(csv\)/i,
        });
        expect(link).toBeInTheDocument();
      });
    });
    it("does not render the other buttons in the action menu", async () => {
      const user = userEvent.setup();
      // render component
      render(wrappedView("99", "99"));

      expect(screen.queryAllByRole("button")).toHaveLength(1);
      expect(screen.queryAllByRole("link")).toHaveLength(0);

      const button = screen.getByRole("button", { name: /actions/i });
      user.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole("link", {
            name: /New Chart String Here/i,
          })
        ).toBeInTheDocument();
        const buttons = screen.queryAllByRole("button");
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveTextContent("Actions");
        expect(buttons[1]).toHaveTextContent("Export Chart Strings (CSV)");
      });
    });

    //Test COAs have details and use links where appropriate
    //Test search/filter
  });
  describe("when team is not personal and folder is not Default", () => {
    it("renders", async () => {
      // render component
      render(wrappedView("0", "1"));

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      //console.log(screen.debug(undefined, 20000));
    });
    it("renders the team name", async () => {
      // render component
      render(wrappedView("0", "1"));

      await waitFor(() => {
        expect(screen.getByText("Team 0")).toBeInTheDocument();
      });
    });
    it("renders the folder name", async () => {
      // render component
      render(wrappedView("0", "1"));

      await waitFor(() => {
        expect(screen.getByText("Folder 1")).toBeInTheDocument();
      });
    });
    it("renders the folder description", async () => {
      // render component
      render(wrappedView("0", "1"));

      await waitFor(() => {
        expect(screen.getByText("Folder 1 description")).toBeInTheDocument();
      });
    });
    it("renders the actions button", async () => {
      // render component
      render(wrappedView("0", "1"));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /actions/i })
        ).toBeInTheDocument();
      });
    });

    //Test various folder permissions and the actions it shows
    //Test COAs have details and use links where appropriate
    //Test search/filter
  });
});

const wrappedView = (teamId: string, folderId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/folders/${folderId}`]}>
      <Routes>
        <Route path="/teams/:teamId/folders/:folderId" element={<Folder />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
