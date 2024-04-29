import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { server } from "../../../test/mocks/node";
import Team from "./Team";
import userEvent from "@testing-library/user-event";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Team", () => {
  describe("renders tests", () => {
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
          expect(
            screen.queryByText("Folder 0 description")
          ).toBeInTheDocument();
          expect(screen.queryByText("Folder 1")).toBeInTheDocument();
          expect(
            screen.queryByText("Folder 1 description")
          ).toBeInTheDocument();
          expect(screen.queryAllByText("Go to Folder").length).toBe(2);
        });

        // search for folder
        const searchField = screen.getByRole("searchbox");
        //type text into the search field
        await user.type(searchField, "folder 0");

        await waitFor(() => {
          expect(screen.queryByText("Folder 0")).toBeInTheDocument();
          expect(
            screen.queryByText("Folder 0 description")
          ).toBeInTheDocument();
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
          expect(
            screen.queryByText("Folder 0 description")
          ).toBeInTheDocument();
          expect(screen.queryByText("Folder 1")).toBeInTheDocument();
          expect(
            screen.queryByText("Folder 1 description")
          ).toBeInTheDocument();
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
          expect(
            screen.queryByText("Folder 1 description")
          ).toBeInTheDocument();
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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

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
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.queryByRole("button", {
                name: /delete team/i,
              })
            ).not.toBeInTheDocument();
          });
        });
      });
      describe("Admin only permissions", () => {
        let teamNumber: string;
        beforeEach(async () => {
          teamNumber = "13";
          // render component
          render(wrappedView(teamNumber));
          await waitFor(() => {
            expect(screen.getByText(`Team ${teamNumber}`)).toBeInTheDocument();
          });
        });
        it("renders the actions button for team 13", async () => {
          await waitFor(() => {
            expect(
              screen.getByRole("button", {
                name: /actions/i,
              })
            ).toBeInTheDocument();
          });
        });
        it("does not renders view team admin action for team 13", async () => {
          const user = userEvent.setup();

          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.queryByRole("link", {
                name: /view team admins/i,
              })
            ).not.toBeInTheDocument();
          });
        });
        it("renders leave team action for team 13", async () => {
          const user = userEvent.setup();

          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.getByRole("button", {
                name: /leave team/i,
              })
            ).toBeInTheDocument();
          });
        });
        it("renders create new folder action for team 13", async () => {
          const user = userEvent.setup();

          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.getByRole("link", {
                name: /create new folder/i,
              })
            ).toBeInTheDocument();
          });
        });
        it("renders edit team action for team 13", async () => {
          const user = userEvent.setup();

          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.queryByRole("link", {
                name: /edit team/i,
              })
            ).toBeInTheDocument();
          });
        });
        it("renders manage team users action for team 13", async () => {
          const user = userEvent.setup();

          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.queryByRole("link", {
                name: /manage team users/i,
              })
            ).toBeInTheDocument();
          });
        });
        it("renders delete team action for team 13", async () => {
          const user = userEvent.setup();

          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.queryByRole("button", {
                name: /delete team/i,
              })
            ).toBeInTheDocument();
          });
        });
      });
    });
  });
  describe("action tests", () => {
    //TODO: , manage team users, delete team, leave team, create new folder, edit team
    beforeEach(() => {
      vi.mock("../../components/Shared/LoadingAndErrors/FinToast", () => ({
        default: vi.fn(),
      }));
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("routes to view team admins", async () => {
      const teamId = "10";
      const user = userEvent.setup();

      render(wrappedView(teamId));
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /actions/i })
        ).toBeInTheDocument();
        expect(
          screen.getByText("Team 10 description with View permission only")
        ).toBeInTheDocument();
      });

      const button = screen.getByRole("button", { name: /actions/i });
      await user.click(button);

      await waitFor(() => {
        const link = screen.getByRole("link", {
          name: /view team admins/i,
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", `/teams/${teamId}/admins`);
      });
      const link = screen.getByRole("link", {
        name: /view team admins/i,
      });
      await user.click(link);
      await waitFor(() => {
        expect(
          screen.getByText("Redirected to team admins")
        ).toBeInTheDocument();
      });
    });
    describe("leave team tests", () => {
      it("calls dialog box when leave team is clicked", async () => {
        const teamId = "10";
        const user = userEvent.setup();

        render(wrappedView(teamId));
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /actions/i })
          ).toBeInTheDocument();
          expect(
            screen.getByText("Team 10 description with View permission only")
          ).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        await user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
        const leaveButton = screen.getByRole("button", {
          name: /leave team/i,
        });
        await user.click(leaveButton);
        await waitFor(() => {
          expect(
            screen.getByRole("heading", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /close/i,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByText("Are you sure you want to leave this team?")
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /cancel/i,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /leave/i,
            })
          ).toBeInTheDocument();
        });
      });
      it("closes dialog box when cancel is clicked", async () => {
        const teamId = "10";
        const user = userEvent.setup();

        render(wrappedView(teamId));
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /actions/i })
          ).toBeInTheDocument();
          expect(
            screen.getByText("Team 10 description with View permission only")
          ).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        await user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
        const leaveButton = screen.getByRole("button", {
          name: /leave team/i,
        });
        await user.click(leaveButton);

        //Verify dialog box is open
        await waitFor(() => {
          expect(
            screen.getByText("Are you sure you want to leave this team?")
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /cancel/i,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /leave/i,
            })
          ).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole("button", {
          name: /cancel/i,
        });
        await user.click(cancelButton);
        await waitFor(() => {
          expect(
            screen.getByText("Team 10 description with View permission only")
          ).toBeInTheDocument();
          expect(
            screen.queryByRole("heading", {
              name: /leave team/i,
            })
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText("Are you sure you want to leave this team?")
          ).not.toBeInTheDocument();
        });
      });
      it("closes dialog box when close is clicked", async () => {
        const teamId = "10";
        const user = userEvent.setup();

        render(wrappedView(teamId));
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /actions/i })
          ).toBeInTheDocument();
          expect(
            screen.getByText("Team 10 description with View permission only")
          ).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        await user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
        const leaveButton = screen.getByRole("button", {
          name: /leave team/i,
        });
        await user.click(leaveButton);

        //Verify dialog box is open
        await waitFor(() => {
          expect(
            screen.getByText("Are you sure you want to leave this team?")
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /cancel/i,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /leave/i,
            })
          ).toBeInTheDocument();
        });

        const closeButton = screen.getByRole("button", {
          name: /close/i,
        });
        await user.click(closeButton);
        await waitFor(() => {
          expect(
            screen.getByText("Team 10 description with View permission only")
          ).toBeInTheDocument();
          expect(
            screen.queryByRole("heading", {
              name: /leave team/i,
            })
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText("Are you sure you want to leave this team?")
          ).not.toBeInTheDocument();
        });
      });
      it("leaves team when leave is clicked", async () => {
        const teamId = "10";
        const user = userEvent.setup();

        render(wrappedView(teamId));
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /actions/i })
          ).toBeInTheDocument();
          expect(
            screen.getByText("Team 10 description with View permission only")
          ).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        await user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
        const leaveButton = screen.getByRole("button", {
          name: /leave team/i,
        });
        await user.click(leaveButton);

        //Verify dialog box is open
        await waitFor(() => {
          expect(
            screen.getByText("Are you sure you want to leave this team?")
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /cancel/i,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /leave/i,
            })
          ).toBeInTheDocument();
        });

        const leaveTeamButton = screen.getByRole("button", {
          name: /leave/i,
        });
        await user.click(leaveTeamButton);
        await waitFor(() => {
          expect(addFinToast).toBeCalledWith(
            "success",
            "Team left successfully."
          );

          expect(screen.getByText("Redirected to teams")).toBeInTheDocument();
        });
      });
      it("generates an error toast when leave team fails", async () => {
        const teamId = "998";

        const user = userEvent.setup();

        render(wrappedView(teamId));
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /actions/i })
          ).toBeInTheDocument();
        });

        const button = screen.getByRole("button", { name: /actions/i });
        await user.click(button);

        await waitFor(() => {
          expect(
            screen.getByRole("button", {
              name: /leave team/i,
            })
          ).toBeInTheDocument();
        });
        const leaveButton = screen.getByRole("button", {
          name: /leave team/i,
        });
        await user.click(leaveButton);

        //Verify dialog box is open
        await waitFor(() => {
          expect(
            screen.getByText("Are you sure you want to leave this team?")
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /cancel/i,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("button", {
              name: /leave/i,
            })
          ).toBeInTheDocument();
        });

        const leaveFolderButton = screen.getByRole("button", {
          name: /leave/i,
        });
        await user.click(leaveFolderButton);
        await waitFor(() => {
          expect(addFinToast).toBeCalledWith("error", "Error leaving team.");
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
        <Route
          path="/teams/:teamId/admins"
          element={<div>Redirected to team admins</div>}
        />
        <Route path="/teams" element={<div>Redirected to teams</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
