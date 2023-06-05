import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { fakeCharts } from "./util/mockData";
import { cleanupApiMocks, mockApi } from "./util/test";

afterAll(() => {
  cleanupApiMocks();
});

const mockSavedChartsCall = () => {
  mockApi().get("/api/charts/all").reply(200, fakeCharts);
};

const mockUserInfoCall = () => {
  mockApi().get("/api/user/info").reply(200, {});
};

describe("App", () => {
  it("shows landing page once user logged in", async () => {
    mockUserInfoCall();
    mockSavedChartsCall();

    render(wrappedView());

    // should see landing page
    await waitFor(() => {
      expect(
        screen.getByText("Create new chart from scratch")
      ).toBeInTheDocument();
    });
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>
);
