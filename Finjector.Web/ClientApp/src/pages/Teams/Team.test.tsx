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

      // await waitFor(() => {
      //   console.log(screen.debug(undefined, 20000));
      // });
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
    it("does not render the actions button", async () => {
      // render component
      render(wrappedView("99"));

      await waitFor(() => {
        const actionsButton = screen.queryByRole("button", {
          name: /actions/i,
        });
        expect(actionsButton).not.toBeInTheDocument();
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

    it("filters folders for team 0", async () => {
      const user = userEvent.setup();
      // render component
      render(wrappedView("0"));

      await waitFor(() => {
        expect(screen.queryByText("Folder 0")).toBeInTheDocument(); //These are the same for both teams 0 and 1 in the mocked data
        expect(screen.queryByText("Folder 0 description")).toBeInTheDocument();
        expect(screen.queryByText("Folder 1")).toBeInTheDocument();
        expect(screen.queryByText("Folder 1 description")).toBeInTheDocument();
        expect(screen.queryAllByText("Go to Folder").length).toBe(2);
      });

      // search for folder
      const searchField = screen.getByRole("searchbox");
      //type text into the search field
      await user.type(searchField, "folder 0");

      await waitFor(() => {
        expect(screen.queryByText("Folder 0")).toBeInTheDocument();
        expect(screen.queryByText("Folder 0 description")).toBeInTheDocument();
        expect(screen.queryByText("Folder 1")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Folder 1 description")
        ).not.toBeInTheDocument();
        expect(screen.queryAllByText("Go to Folder").length).toBe(1);
      });
    });

    it("filters folders for team 0 test 2", async () => {
      const user = userEvent.setup();
      // render component
      render(wrappedView("0"));

      await waitFor(() => {
        expect(screen.queryByText("Folder 0")).toBeInTheDocument(); //These are the same for both teams 0 and 1 in the mocked data
        expect(screen.queryByText("Folder 0 description")).toBeInTheDocument();
        expect(screen.queryByText("Folder 1")).toBeInTheDocument();
        expect(screen.queryByText("Folder 1 description")).toBeInTheDocument();
        expect(screen.queryAllByText("Go to Folder").length).toBe(2);
      });

      // search for folder
      const searchField = screen.getByRole("searchbox");
      //type text into the search field
      await user.type(searchField, "1");

      await waitFor(() => {
        expect(screen.queryByText("Folder 0")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Folder 0 description")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Folder 1")).toBeInTheDocument();
        expect(screen.queryByText("Folder 1 description")).toBeInTheDocument();
        expect(screen.queryAllByText("Go to Folder").length).toBe(1);
      });
    });
    it("renders the actions button for team 0", async () => {
      // render component
      render(wrappedView("0"));

      await waitFor(() => {
        expect(
          screen.getByRole("button", {
            name: /actions/i,
          })
        ).toBeInTheDocument();
      });
    });
    describe("View only permissions", () => {
      it("renders the actions button for team 10", async () => {
        // render component
        render(wrappedView("10"));

        await waitFor(() => {
          expect(screen.getByText("Team 10")).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /actions/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders view team admin action for team 10", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("10"));

        await waitFor(() => {
          expect(screen.getByText("Team 10")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("link", {
              name: /view team admins/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders leave team action for team 10", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("10"));

        await waitFor(() => {
          expect(screen.getByText("Team 10")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("does not render create new folder action for team 10", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("10"));

        await waitFor(() => {
          expect(screen.getByText("Team 10")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("link", {
              name: /create new folder/i,
            })
          ).not.toBeInTheDocument();
        });
      });
      it("does not render edit team action for team 10", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("10"));

        await waitFor(() => {
          expect(screen.getByText("Team 10")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("link", {
              name: /edit team/i,
            })
          ).not.toBeInTheDocument();
        });
      });
      it("does not render manage team users action for team 10", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("10"));

        await waitFor(() => {
          expect(screen.getByText("Team 10")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("link", {
              name: /manage team users/i,
            })
          ).not.toBeInTheDocument();
        });
      });
      it("does not render delete team action for team 10", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("10"));

        await waitFor(() => {
          expect(screen.getByText("Team 10")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("button", {
              name: /delete team/i,
            })
          ).not.toBeInTheDocument();
        });
      });
    });
    describe("View and Edit permissions", () => {
      it("renders the actions button for team 11", async () => {
        // render component
        render(wrappedView("11"));

        await waitFor(() => {
          expect(screen.getByText("Team 11")).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /actions/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders view team admin action for team 11", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("11"));

        await waitFor(() => {
          expect(screen.getByText("Team 11")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("link", {
              name: /view team admins/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders leave team action for team 11", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("11"));

        await waitFor(() => {
          expect(screen.getByText("Team 11")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders create new folder action for team 11", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("11"));

        await waitFor(() => {
          expect(screen.getByText("Team 11")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("link", {
              name: /create new folder/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("does not render edit team action for team 11", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("11"));

        await waitFor(() => {
          expect(screen.getByText("Team 11")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("link", {
              name: /edit team/i,
            })
          ).not.toBeInTheDocument();
        });
      });
      it("does not render manage team users action for team 11", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("11"));

        await waitFor(() => {
          expect(screen.getByText("Team 11")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("link", {
              name: /manage team users/i,
            })
          ).not.toBeInTheDocument();
        });
      });
      it("does not render delete team action for team 11", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("11"));

        await waitFor(() => {
          expect(screen.getByText("Team 11")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("button", {
              name: /delete team/i,
            })
          ).not.toBeInTheDocument();
        });
      });
    });
    describe("Edit only permissions", () => {
      it("renders the actions button for team 12", async () => {
        // render component
        render(wrappedView("12"));

        await waitFor(() => {
          expect(screen.getByText("Team 12")).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /actions/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders view team admin action for team 12", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("12"));

        await waitFor(() => {
          expect(screen.getByText("Team 12")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("link", {
              name: /view team admins/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders leave team action for team 12", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("12"));

        await waitFor(() => {
          expect(screen.getByText("Team 12")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("renders create new folder action for team 12", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("12"));

        await waitFor(() => {
          expect(screen.getByText("Team 12")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("link", {
              name: /create new folder/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("does not render edit team action for team 12", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("12"));

        await waitFor(() => {
          expect(screen.getByText("Team 12")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("link", {
              name: /edit team/i,
            })
          ).not.toBeInTheDocument();
        });
      });
      it("does not render manage team users action for team 12", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("12"));

        await waitFor(() => {
          expect(screen.getByText("Team 12")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("link", {
              name: /manage team users/i,
            })
          ).not.toBeInTheDocument();
        });
      });
      it("does not render delete team action for team 12", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("12"));

        await waitFor(() => {
          expect(screen.getByText("Team 12")).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        user.click(button);

        await waitFor(() => {
          expect(
            screen.queryByRole("button", {
              name: /delete team/i,
            })
          ).not.toBeInTheDocument();
        });
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
