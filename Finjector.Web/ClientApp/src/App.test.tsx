import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { beforeAll, afterAll } from "vitest";
import { server } from "../test/mocks/node";

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("App", () => {
  it("shows landing page once user logged in", async () => {
    render(wrappedView());

    // should see landing page
    await waitFor(() => {
      expect(
        screen.getByText("New Chart String from Scratch")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Finjector")).toBeInTheDocument();
      expect(screen.getByText("Chart Strings")).toBeInTheDocument();
      expect(screen.getByText("Teams")).toBeInTheDocument();
      expect(screen.getByText("Help")).toBeInTheDocument();
    });
    //console.log(screen.debug());
  });

  it("Has link to the home page from Finjector", async () => {
    render(wrappedView());

    // should see landing page
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /Finjector/i });
      expect(link).toHaveAttribute("href", "/");
    });
  });

  it("Has link to the home page from Chart Strings", async () => {
    render(wrappedView());

    // should see landing page
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /Chart Strings/i });
      expect(link).toHaveAttribute("href", "/");
    });
  });

  it("Has link to Teams", async () => {
    render(wrappedView());

    // should see landing page
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /Teams/i });
      expect(link).toHaveAttribute("href", "/teams");
    });
  });

  it("Has link to Help", async () => {
    render(wrappedView());

    // should see landing page
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /Help/i });
      expect(link).toHaveAttribute("href", "/help");
    });
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>
);
