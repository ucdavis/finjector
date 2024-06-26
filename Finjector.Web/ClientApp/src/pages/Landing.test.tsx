import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../test/mocks/node";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { fakeTeams, fakeFolders } from "../../test/mocks/mockData";

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

// test main landing page
describe("Landing", () => {
  it("renders", () => {
    // render component
    render(wrappedView());

    // should see the create new chart buttons
    expect(
      screen.getByRole("link", { name: /New Chart String from Scratch/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /New Chart String from Paste/i })
    ).toBeInTheDocument();
  });

  //test that it renders the search/filter entry field
  it("renders search/filter", () => {
    // render component
    render(wrappedView());

    // should see the search/filter field
    //get the search field by name value

    const searchField = screen.getByRole("searchbox");
    expect(searchField).toBeInTheDocument();
    //check that the search field has expected placeholder text
    expect(searchField).toHaveAttribute(
      "placeholder",
      "Search my chart strings, teams and folders"
    );
  });

  // test that it renders the title
  it("renders title", async () => {
    // render component
    render(wrappedView());

    // should see the title
    expect(
      screen.getByText("Scribbling in your Chart Strings...")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("My Chart Strings")).toBeInTheDocument();
    });
  });

  it("loads saved charts", async () => {
    // render component
    render(wrappedView());

    // should see list of saved charts (3 from our mock data)
    await waitFor(() => {
      expect(screen.getByText("Chart 1")).toBeInTheDocument();
      expect(screen.getByText("Team 0")).toBeInTheDocument();
      expect(screen.getByText("Folder 0")).toBeInTheDocument();
    });
  });

  it("Example to override what the mock is returning", async () => {
    //override the mocked data to set specific values for the team and folder
    server.use(
      http.get("/api/charts/all", () =>
        HttpResponse.json([
          {
            team: fakeTeams[2],
            folders: [fakeFolders[2]],
          },
        ])
      )
    );
    // render component
    render(wrappedView());

    // should see list of saved charts (3 from our mock data)
    await waitFor(() => {
      expect(screen.getByText("Chart 1")).toBeInTheDocument();
      expect(screen.getByText("Team 2")).toBeInTheDocument();
      expect(screen.getByText("Folder 2")).toBeInTheDocument();
    });

    //console.log(screen.debug());
  });

  //Test that the search/filter field works
  it("searches for a chart", async () => {
    const user = userEvent.setup(); // at the top of the test

    // render component
    render(wrappedView());

    // should see list of saved charts (3 from our mock data)
    await waitFor(() => {
      expect(screen.getByText("Chart 1")).toBeInTheDocument();
      expect(screen.getByText("Chart 2")).toBeInTheDocument();
    });

    // search for a chart
    const searchField = screen.getByRole("searchbox");

    //type text into the search field
    await user.type(searchField, "Chart 2");

    // should only see the chart we searched for
    await waitFor(() => {
      expect(screen.getByText("Chart 2")).toBeInTheDocument();
      //Expect that the other chart is not present
      expect(screen.queryByText("Chart 1")).not.toBeInTheDocument();
    });
    //show what the screen looks like
    //console.log(screen.debug());
  });

  it("expects details and use buttons", async () => {
    // Mock window.opener
    Object.defineProperty(window, "opener", {
      writable: true,
      value: {}, // non-null object makes window.opener truthy
    });

    const user = userEvent.setup(); // at the top of the test
    // render component
    render(wrappedView());

    // search for a chart
    const searchField = screen.getByRole("searchbox");

    //type text into the search field
    await user.type(searchField, "Chart 2");

    await waitFor(() => {
      expect(screen.queryByText("Details")).toBeInTheDocument();
      expect(screen.queryByText("Use")).toBeInTheDocument();
    });

    // reset window.opener so it doesn't persist between tests
    Object.defineProperty(window, "opener", {
      writable: true,
      value: null, // non-null object makes window.opener falsy
    });
  });
  it("expects details but not use", async () => {
    const user = userEvent.setup(); // at the top of the test

    // render component
    render(wrappedView());

    // search for a chart
    const searchField = screen.getByRole("searchbox");

    //type text into the search field
    await user.type(searchField, "Chart 2");

    await waitFor(() => {
      expect(screen.queryByText("Details")).toBeInTheDocument();
      expect(screen.queryByText("Use")).not.toBeInTheDocument();
    });
  });
});
const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/`]}>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
