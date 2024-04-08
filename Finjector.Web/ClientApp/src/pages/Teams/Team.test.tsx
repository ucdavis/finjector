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
  describe("when team is personal", () => {
    it("renders", async () => {
      // render component
      render(wrappedView("99"));

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      await waitFor(() => {
        console.log(screen.debug(undefined, 20000));
      });
    });

    it("renders team name", async () => {
      // render component
      render(wrappedView("99"));

      await waitFor(() => {
        expect(screen.getByText("Personal")).toBeInTheDocument();
      });
    });

    it("renders the default folder", async () => {
      // render component
      render(wrappedView("99"));

      await waitFor(() => {
        expect(screen.getByText("Default")).toBeInTheDocument();
      });
    });

    it("doesn't renders search box", async () => {
      // render component
      render(wrappedView("99"));

      await waitFor(() => {
        const searchField = screen.queryByRole("searchbox");
        expect(searchField).not.toBeInTheDocument();
      });
    });

    it("renders the default folder link", async () => {
      // render component
      render(wrappedView("99"));

      await waitFor(() => {
        const folderLink = screen.getByRole("link", { name: "Go to Folder" });
        expect(folderLink).toBeInTheDocument();
        expect(folderLink).toHaveAttribute("href", "/teams/99/folders/99");
      });
    });
  });
  describe("when team is not personal", () => {
    it("renders team 0", async () => {
      // render component
      render(wrappedView("0"));

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Team 0")).toBeInTheDocument();
        expect(screen.getByText("Team 0 description")).toBeInTheDocument();
      });
    });
    it("renders team 1", async () => {
      // render component
      render(wrappedView("1"));

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Team 1")).toBeInTheDocument();
        expect(screen.getByText("Team 1 description")).toBeInTheDocument();
      });
    });
    it("renders team 0 folder", async () => {
      // render component
      render(wrappedView("0"));

      await waitFor(() => {
        expect(screen.getByText("Folder 0")).toBeInTheDocument(); //These are the same for both teams 0 and 1 in the mocked data
        expect(screen.getByText("Folder 0 description")).toBeInTheDocument();
        expect(screen.getByText("Folder 1")).toBeInTheDocument();
        expect(screen.getByText("Folder 1 description")).toBeInTheDocument();
        expect(screen.queryAllByText("Go to Folder").length).toBe(2);
      });
    });
    it("renders the folder links for team 0", async () => {
      // render component
      render(wrappedView("0"));

      await waitFor(() => {
        const folderLinks = screen.getAllByRole("link", {
          name: "Go to Folder",
        });
        expect(folderLinks[0]).toBeInTheDocument();
        expect(folderLinks[0]).toHaveAttribute("href", "/teams/0/folders/0");
        expect(folderLinks[1]).toBeInTheDocument();
        expect(folderLinks[1]).toHaveAttribute("href", "/teams/0/folders/1");
      });
    });
    it("renders the folder links for team 1", async () => {
      // render component
      render(wrappedView("1"));

      await waitFor(() => {
        const folderLinks = screen.getAllByRole("link", {
          name: "Go to Folder",
        });
        expect(folderLinks[0]).toBeInTheDocument();
        expect(folderLinks[0]).toHaveAttribute("href", "/teams/1/folders/0");
        expect(folderLinks[1]).toBeInTheDocument();
        expect(folderLinks[1]).toHaveAttribute("href", "/teams/1/folders/1");
      });
    });
    it("renders the search box for team 0", async () => {
      // render component
      render(wrappedView("0"));

      await waitFor(() => {
        const searchField = screen.getByRole("searchbox");
        expect(searchField).toBeInTheDocument();
        expect(searchField).toHaveAttribute(
          "placeholder",
          "Search Within Team 0"
        );
      });
    });
    it("renders the search box for team 1", async () => {
      // render component
      render(wrappedView("1"));

      await waitFor(() => {
        const searchField = screen.getByRole("searchbox");
        expect(searchField).toBeInTheDocument();
        expect(searchField).toHaveAttribute(
          "placeholder",
          "Search Within Team 1"
        );
      });
    });
  });
});

const wrappedView = (teamId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}`]}>
      <Routes>
        <Route path="/teams/:teamId" element={<Team />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
