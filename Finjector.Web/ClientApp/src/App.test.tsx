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
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>
);
