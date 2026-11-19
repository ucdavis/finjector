import React from "react";
import { transferableAbortController } from "node:util";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { beforeAll, afterAll, vi } from "vitest";
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

  it("names the landing page and puts its keyboard bypass first", async () => {
    const user = userEvent.setup();
    render(wrappedView());
    const main = await screen.findByRole("main", { name: "My Chart Strings" });
    await user.tab();
    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute("href", `#${main.id}`);

    expect(document.title).toBe("My Chart Strings | Finjector");
  });

  it("keeps the header in view when navigating from chart details", async () => {
    const user = userEvent.setup();
    render(wrappedView());
    const detailsLink = await screen.findByRole("link", {
      name: "Details for Chart 1",
    });
    const main = screen.getByRole("main");
    const focus = vi.spyOn(main, "focus");
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    // The router uses Node's Request in jsdom, which requires a native Node signal.
    const abort = vi
      .spyOn(globalThis, "AbortController")
      .mockImplementation(transferableAbortController);
    try {
      await user.click(detailsLink);
      await screen.findByRole("main", { name: "Chart String Details" });
      scroll.mockClear();
      focus.mockClear();

      await user.click(screen.getByRole("link", { name: "Bulk Validate" }));
      expect(await screen.findByRole("main", { name: "Bulk Validate" })).toHaveFocus();
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
      expect(scroll).toHaveBeenCalledWith(0, 0);

      scroll.mockClear();
      window.history.back();
      await screen.findByRole("main", { name: "Chart String Details" });
      expect(scroll).not.toHaveBeenCalled();
      await user.click(screen.getByRole("link", { name: "Chart Strings" }));
    } finally {
      abort.mockRestore();
      focus.mockRestore();
      scroll.mockRestore();
    }
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>
);
