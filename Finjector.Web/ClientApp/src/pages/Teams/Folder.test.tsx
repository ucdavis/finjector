import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { server } from "../../../test/mocks/node";
import Folder from "./Folder";
import userEvent from "@testing-library/user-event";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Folder", () => {
  describe("render tests", () => {
    describe("pop up tests", () => {
      describe("Not in popup mode personal", () => {
        it("renders the list of COAs when not in popup mode 1", async () => {
          const user = userEvent.setup();
          // render component
          render(wrappedView("99", "99"));

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "Chart");

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(
              screen.queryByText(
                "3110-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000"
              )
            ).toBeInTheDocument();

            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
            expect(
              screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
            ).toBeInTheDocument();

            expect(screen.queryAllByText("Details").length).toBeGreaterThan(1);
            expect(screen.queryByText("Use")).not.toBeInTheDocument();
          });
        });
        it("renders the list of COAs when not in popup mode 2", async () => {
          const user = userEvent.setup();
          // render component
          render(wrappedView("99", "99"));

          // search for folder
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090");

          await waitFor(() => {
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
            expect(
              screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
            ).toBeInTheDocument();

            const link = screen.getByRole("link", { name: /details/i });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute(
              "href",
              "/teams/99/folders/99/details/98/KL0733ATC1-TASK01-ADNO001-501090"
            );

            expect(screen.queryByText("Details")).toBeInTheDocument();
            expect(screen.queryByText("Use")).not.toBeInTheDocument();
          });
        });
      });
      describe("In popup mode personal", () => {
        beforeEach(() => {
          // Mock window.opener
          Object.defineProperty(window, "opener", {
            writable: true,
            value: {}, // non-null object makes window.opener truthy
          });
        });
        afterEach(() => {
          // reset window.opener so it doesn't persist between tests
          Object.defineProperty(window, "opener", {
            writable: true,
            value: null, // non-null object makes window.opener falsy
          });
        });
        it("renders the list of COAs when in popup mode", async () => {
          const user = userEvent.setup();
          // render component
          render(wrappedView("99", "99"));

          // search for folder
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090");

          await waitFor(() => {
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
            expect(
              screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
            ).toBeInTheDocument();

            const link = screen.getByRole("link", { name: /details/i });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute(
              "href",
              "/teams/99/folders/99/details/98/KL0733ATC1-TASK01-ADNO001-501090"
            );

            const link2 = screen.getByRole("link", { name: /use/i });
            expect(link2).toBeInTheDocument();
            expect(link2).toHaveAttribute(
              "href",
              "/teams/99/folders/99/selected/98/KL0733ATC1-TASK01-ADNO001-501090"
            );

            expect(screen.queryByText("Details")).toBeInTheDocument();
            expect(screen.queryByText("Use")).toBeInTheDocument();
          });
        });
      });
      describe("Not in popup mode not personal", () => {
        it("renders the list of COAs when not in popup mode 1", async () => {
          const user = userEvent.setup();

          // render component
          render(wrappedView("0", "1"));

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "Chart");

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(
              screen.queryByText(
                "3110-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000"
              )
            ).toBeInTheDocument();

            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
            expect(
              screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
            ).toBeInTheDocument();

            expect(screen.queryAllByText("Details").length).toBeGreaterThan(1);
            expect(screen.queryByText("Use")).not.toBeInTheDocument();
          });
        });
        it("renders the list of COAs when not in popup mode 2", async () => {
          const user = userEvent.setup();

          // render component
          render(wrappedView("0", "1"));

          // search for folder
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090");

          await waitFor(() => {
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
            expect(
              screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
            ).toBeInTheDocument();

            const link = screen.getByRole("link", { name: /details/i });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute(
              "href",
              `/teams/0/folders/1/details/98/KL0733ATC1-TASK01-ADNO001-501090`
            );

            expect(screen.queryByText("Details")).toBeInTheDocument();
            expect(screen.queryByText("Use")).not.toBeInTheDocument();
          });
        });
      });

      describe("In popup mode not personal", () => {
        beforeEach(() => {
          // Mock window.opener
          Object.defineProperty(window, "opener", {
            writable: true,
            value: {}, // non-null object makes window.opener truthy
          });
        });
        afterEach(() => {
          // reset window.opener so it doesn't persist between tests
          Object.defineProperty(window, "opener", {
            writable: true,
            value: null, // non-null object makes window.opener falsy
          });
        });
        it("renders the list of COAs when in popup mode", async () => {
          const user = userEvent.setup();

          // render component
          render(wrappedView("0", "1"));

          // search for folder
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090");

          await waitFor(() => {
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
            expect(
              screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
            ).toBeInTheDocument();

            const link = screen.getByRole("link", { name: /details/i });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute(
              "href",
              `/teams/0/folders/1/details/98/KL0733ATC1-TASK01-ADNO001-501090`
            );

            const link2 = screen.getByRole("link", { name: /use/i });
            expect(link2).toBeInTheDocument();
            expect(link2).toHaveAttribute(
              "href",
              "/teams/0/folders/1/selected/98/KL0733ATC1-TASK01-ADNO001-501090"
            );

            expect(screen.queryByText("Details")).toBeInTheDocument();
            expect(screen.queryByText("Use")).toBeInTheDocument();
          });
        });
      });
    });

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

        await user.click(button);

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

        await user.click(button);

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
        await user.click(button);

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

      describe("Search/Filter tests", () => {
        it("renders the search bar", async () => {
          // render component
          render(wrappedView("99", "99"));

          await waitFor(() => {
            expect(
              screen.getByPlaceholderText("Search Within Folder")
            ).toBeInTheDocument();
          });
        });
        it("filters the list of COAs 1", async () => {
          const user = userEvent.setup();
          // render component
          render(wrappedView("99", "99"));

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "Chart 1");

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
          });
        });

        it("filters the list of COAs 2", async () => {
          const user = userEvent.setup();
          // render component
          render(wrappedView("99", "99"));

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "3111"); //search for a chart string

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
          });
        });

        it("filters the list of COAs 3", async () => {
          const user = userEvent.setup();
          // render component
          render(wrappedView("99", "99"));

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090"); //search for a chart string

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });
        });

        it("filters the list of COAs 4", async () => {
          const user = userEvent.setup();
          // render component
          render(wrappedView("99", "99"));

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-XXXXXX-ADNO001-501090"); //search for a chart string that doesn't exist

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).not.toBeInTheDocument();
          });
        });
      });
      it("renders the COA for PPM", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("99", "99"));

        const searchField = screen.getByRole("searchbox");
        //type text into the search field
        await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090");

        await waitFor(() => {
          expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          expect(
            screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
          ).toBeInTheDocument();
          expect(screen.queryByText("PPM")).toBeInTheDocument();
          expect(screen.queryByText("GL")).not.toBeInTheDocument();
        });
      });
      it("renders the COA for GL", async () => {
        const user = userEvent.setup();
        // render component
        render(wrappedView("99", "99"));

        const searchField = screen.getByRole("searchbox");
        //type text into the search field
        await user.type(
          searchField,
          "3111-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000"
        );

        await waitFor(() => {
          expect(screen.queryByText("Chart 1")).toBeInTheDocument();
          expect(
            screen.queryByText(
              "3111-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000"
            )
          ).toBeInTheDocument();
          expect(screen.queryByText("GL")).toBeInTheDocument();
          expect(screen.queryByText("PPM")).not.toBeInTheDocument();
        });
      });
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
      describe("Coa Display tests", () => {
        const teamId = "0";
        const folderId = "1";
        beforeEach(async () => {
          // render component
          render(wrappedView(teamId, folderId));
          await waitFor(() => {
            expect(
              screen.getByPlaceholderText("Search Within Folder")
            ).toBeInTheDocument();
            expect(
              screen.getByText("Folder 1 description")
            ).toBeInTheDocument();
          });
        });

        it("renders the COA for PPM", async () => {
          const user = userEvent.setup();

          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090");

          await waitFor(() => {
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
            expect(
              screen.queryByText("KL0733ATC1-TASK01-ADNO001-501090")
            ).toBeInTheDocument();
            expect(screen.queryByText("PPM")).toBeInTheDocument();
            expect(screen.queryByText("GL")).not.toBeInTheDocument();
          });
        });
        it("renders the COA for GL", async () => {
          const user = userEvent.setup();

          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(
            searchField,
            "3111-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000"
          );

          await waitFor(() => {
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(
              screen.queryByText(
                "3111-69882-ADNO001-480000-00-000-0000000000-000000-0000-000000-000000"
              )
            ).toBeInTheDocument();
            expect(screen.queryByText("GL")).toBeInTheDocument();
            expect(screen.queryByText("PPM")).not.toBeInTheDocument();
          });
        });
      });

      describe("Search/Filter tests", () => {
        const teamId = "0";
        const folderId = "1";
        beforeEach(async () => {
          // render component
          render(wrappedView(teamId, folderId));
          await waitFor(() => {
            expect(
              screen.getByPlaceholderText("Search Within Folder")
            ).toBeInTheDocument();
            expect(
              screen.getByText("Folder 1 description")
            ).toBeInTheDocument();
          });
        });
        it("renders the search bar", async () => {
          await waitFor(() => {
            expect(
              screen.getByPlaceholderText("Search Within Folder")
            ).toBeInTheDocument();
          });
        });
        it("filters the list of COAs 1", async () => {
          const user = userEvent.setup();

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "Chart 1");

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
          });
        });

        it("filters the list of COAs 2", async () => {
          const user = userEvent.setup();

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "3111"); //search for a chart string

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
          });
        });

        it("filters the list of COAs 3", async () => {
          const user = userEvent.setup();
          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-TASK01-ADNO001-501090"); //search for a chart string

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });
        });

        it("filters the list of COAs 4", async () => {
          const user = userEvent.setup();

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).toBeInTheDocument();
          });

          // search for coa
          const searchField = screen.getByRole("searchbox");
          //type text into the search field
          await user.type(searchField, "KL0733ATC1-XXXXXX-ADNO001-501090"); //search for a chart string that doesn't exist

          await waitFor(() => {
            expect(screen.queryByText("Chart 0")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 1")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 2")).not.toBeInTheDocument();
            expect(screen.queryByText("Chart 98")).not.toBeInTheDocument();
          });
        });
      });

      describe("Permissions tests", () => {
        describe("View Only Permissions tests", () => {
          const teamId = "0";
          const folderId = "10";
          beforeEach(async () => {
            // render component
            render(wrappedView(teamId, folderId));
            await waitFor(() => {
              expect(
                screen.getByRole("button", { name: /actions/i })
              ).toBeInTheDocument();
              expect(
                screen.getByText(
                  "Folder 10 description with View permission only"
                )
              ).toBeInTheDocument();
            });
          });
          it("renders view folder admins with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /view folder admins/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/admins`
              );
            });
          });
          it("renders leave folder button with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /leave folder/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("renders export chart strings button with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /export chart strings \(csv\)/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("does not render new chart string here link in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /new chart string here/i,
                })
              ).not.toBeInTheDocument();
            });
          });
          it("does not render edit folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /edit folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render delete folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("button", {
                  name: /delete folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render manage permissions link in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /manage permissions/i,
                })
              ).not.toBeInTheDocument();
            });
          });
        });

        describe("Edit and View Permissions tests", () => {
          const teamId = "0";
          const folderId = "11";
          beforeEach(async () => {
            // render component
            render(wrappedView(teamId, folderId));
            await waitFor(() => {
              expect(
                screen.getByRole("button", { name: /actions/i })
              ).toBeInTheDocument();
              expect(
                screen.getByText(
                  "Folder 11 description with View and Edit permissions"
                )
              ).toBeInTheDocument();
            });
          });
          it("renders view folder admins with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /view folder admins/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/admins`
              );
            });
          });
          it("renders leave folder button with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /leave folder/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("renders export chart strings button with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /export chart strings \(csv\)/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("renders new chart string here link in the action menu with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.queryByRole("link", {
                name: /new chart string here/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/entry`
              );
            });
          });
          it("does not render edit folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /edit folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render delete folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("button", {
                  name: /delete folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render manage permissions link in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /manage permissions/i,
                })
              ).not.toBeInTheDocument();
            });
          });
        });

        describe("Edit only Permissions tests", () => {
          const teamId = "0";
          const folderId = "12";
          beforeEach(async () => {
            // render component
            render(wrappedView(teamId, folderId));
            await waitFor(() => {
              expect(
                screen.getByRole("button", { name: /actions/i })
              ).toBeInTheDocument();
              expect(
                screen.getByText(
                  "Folder 12 description with Edit permission only"
                )
              ).toBeInTheDocument();
            });
          });
          it("renders view folder admins with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /view folder admins/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/admins`
              );
            });
          });
          it("renders leave folder button with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /leave folder/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("renders export chart strings button with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /export chart strings \(csv\)/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("renders new chart string here link in the action menu with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.queryByRole("link", {
                name: /new chart string here/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/entry`
              );
            });
          });
          it("does not render edit folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /edit folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render delete folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("button", {
                  name: /delete folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render manage permissions link in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /manage permissions/i,
                })
              ).not.toBeInTheDocument();
            });
          });
        });

        describe("Admin Permissions tests", () => {
          const teamId = "0";
          const folderId = "13";
          beforeEach(async () => {
            // render component
            render(wrappedView(teamId, folderId));
            await waitFor(() => {
              expect(
                screen.getByRole("button", { name: /actions/i })
              ).toBeInTheDocument();
              expect(
                screen.getByText(
                  "Folder 13 description with Admin permission only"
                )
              ).toBeInTheDocument();
            });
          });

          it("renders new chart string here link in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.queryByRole("link", {
                name: /new chart string here/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/entry`
              );
            });
          });

          it("renders manage permissions in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /manage permissions/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/permissions`
              );
            });
          });

          it("renders edit folder in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /edit folder/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/edit`
              );
            });
          });
          it("renders delete folder in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("button", {
                  name: /delete folder/i,
                })
              ).toBeInTheDocument();
            });
          });
        });
        describe("Admin Team View Folder Permissions tests", () => {
          const teamId = "0";
          const folderId = "14";
          beforeEach(async () => {
            // render component
            render(wrappedView(teamId, folderId));
            await waitFor(() => {
              expect(
                screen.getByRole("button", { name: /actions/i })
              ).toBeInTheDocument();
              expect(
                screen.getByText(
                  "Folder 14 description with Admin team and view folder permission only"
                )
              ).toBeInTheDocument();
            });
          });

          it("renders new chart string here link in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.queryByRole("link", {
                name: /new chart string here/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/entry`
              );
            });
          });

          it("renders manage permissions in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /manage permissions/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/permissions`
              );
            });
          });

          it("renders edit folder in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /edit folder/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/edit`
              );
            });
          });
          it("renders delete folder in the action menu with admin permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("button", {
                  name: /delete folder/i,
                })
              ).toBeInTheDocument();
            });
          });
        });
        describe("Edit team View folder  Permissions tests", () => {
          const teamId = "0";
          const folderId = "15";
          beforeEach(async () => {
            // render component
            render(wrappedView(teamId, folderId));
            await waitFor(() => {
              expect(
                screen.getByRole("button", { name: /actions/i })
              ).toBeInTheDocument();
              expect(
                screen.getByText(
                  "Folder 15 description with Edit team and view folder permission only"
                )
              ).toBeInTheDocument();
            });
          });
          it("renders view folder view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.getByRole("link", {
                name: /view folder admins/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/admins`
              );
            });
          });
          it("renders leave folder button with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /leave folder/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("renders export chart strings button with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.getByRole("button", {
                  name: /export chart strings \(csv\)/i,
                })
              ).toBeInTheDocument();
            });
          });
          it("renders new chart string here link in the action menu with view and edit permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              const link = screen.queryByRole("link", {
                name: /new chart string here/i,
              });
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute(
                "href",
                `/teams/${teamId}/folders/${folderId}/entry`
              );
            });
          });
          it("does not render edit folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /edit folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render delete folder in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("button", {
                  name: /delete folder/i,
                })
              ).not.toBeInTheDocument();
            });
          });

          it("does not render manage permissions link in the action menu with view only permissions", async () => {
            const user = userEvent.setup();

            const button = screen.getByRole("button", { name: /actions/i });
            await user.click(button);

            await waitFor(() => {
              expect(
                screen.queryByRole("link", {
                  name: /manage permissions/i,
                })
              ).not.toBeInTheDocument();
            });
          });
        });
      });
    });
  });
  describe("action tests", () => {
    //todo: New chart string here, manage permissions, edit folder, delete folder, leave folder
    //todo: the view admins link
    //todo: click on details button/row
    //ignore the use one for now

    beforeEach(() => {
      vi.mock("../../components/Shared/LoadingAndErrors/FinToast", () => ({
        default: vi.fn(),
      }));
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("redirects to team admins page when view folder admins is clicked", async () => {
      const teamId = "0";
      const folderId = "10"; //View only folder permissions
      const user = userEvent.setup();

      render(wrappedView(teamId, folderId));
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /actions/i })
        ).toBeInTheDocument();
        expect(
          screen.getByText("Folder 10 description with View permission only")
        ).toBeInTheDocument();
      });

      const button = screen.getByRole("button", { name: /actions/i });
      await user.click(button);

      await waitFor(() => {
        const link = screen.getByRole("link", {
          name: /view folder admins/i,
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute(
          "href",
          `/teams/${teamId}/folders/${folderId}/admins`
        );
      });
      const link = screen.getByRole("link", {
        name: /view folder admins/i,
      });
      await user.click(link);
      await waitFor(() => {
        expect(
          screen.getByText("Redirected to folder admins")
        ).toBeInTheDocument();
      });
    });
    it("redirects to new chart string page when new chart string here is clicked", async () => {
      const teamId = "0";
      const folderId = "11"; //Edit and View folder permissions
      const user = userEvent.setup();

      render(wrappedView(teamId, folderId));
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /actions/i })
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Folder 11 description with View and Edit permissions"
          )
        ).toBeInTheDocument();
      });

      const button = screen.getByRole("button", { name: /actions/i });
      await user.click(button);

      await waitFor(() => {
        const link = screen.getByRole("link", {
          name: /new chart string here/i,
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute(
          "href",
          `/teams/${teamId}/folders/${folderId}/entry`
        );
      });
      const link = screen.getByRole("link", {
        name: /new chart string here/i,
      });
      await user.click(link);
      await waitFor(() => {
        expect(
          screen.getByText("Redirected to new chart string page")
        ).toBeInTheDocument();
      });
    });
    it("redirects to manage permissions when is clicked", async () => {
      const teamId = "0";
      const folderId = "13"; //manage permissions needs admin role
      const user = userEvent.setup();

      render(wrappedView(teamId, folderId));
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /actions/i })
        ).toBeInTheDocument();
        expect(
          screen.getByText("Folder 13 description with Admin permission only")
        ).toBeInTheDocument();
      });

      const button = screen.getByRole("button", { name: /actions/i });
      await user.click(button);

      await waitFor(() => {
        const link = screen.getByRole("link", {
          name: /manage permissions/i,
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute(
          "href",
          `/teams/${teamId}/folders/${folderId}/permissions`
        );
      });
      const link = screen.getByRole("link", {
        name: /manage permissions/i,
      });
      await user.click(link);
      await waitFor(() => {
        expect(
          screen.getByText("Redirected to manage permissions")
        ).toBeInTheDocument();
      });
    });
    it("redirects to edit folder when is clicked", async () => {
      const teamId = "0";
      const folderId = "13"; // Admin role
      const user = userEvent.setup();

      render(wrappedView(teamId, folderId));
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /actions/i })
        ).toBeInTheDocument();
        expect(
          screen.getByText("Folder 13 description with Admin permission only")
        ).toBeInTheDocument();
      });

      const button = screen.getByRole("button", { name: /actions/i });
      await user.click(button);

      await waitFor(() => {
        const link = screen.getByRole("link", {
          name: /edit folder/i,
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute(
          "href",
          `/teams/${teamId}/folders/${folderId}/edit`
        );
      });
      const link = screen.getByRole("link", {
        name: /edit folder/i,
      });
      await user.click(link);
      await waitFor(() => {
        expect(
          screen.getByText("Redirected to edit folder")
        ).toBeInTheDocument();
      });
    });
    describe("delete folder tests", () => {
      describe("can delete folder", () => {
        const teamId = "0";
        const folderId = "13"; // Admin role
        const user = userEvent.setup();

        beforeEach(async () => {
          render(wrappedView(teamId, folderId));
          await waitFor(() => {
            expect(
              screen.getByRole("button", { name: /actions/i })
            ).toBeInTheDocument();
            expect(
              screen.getByText(
                "Folder 13 description with Admin permission only"
              )
            ).toBeInTheDocument();
          });
        });
        it("calls dialog box when delete folder is clicked", async () => {
          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.getByRole("button", {
                name: /delete folder/i,
              })
            ).toBeInTheDocument();
          });
          const deleteButton = screen.getByRole("button", {
            name: /delete folder/i,
          });
          await user.click(deleteButton);
          await waitFor(() => {
            expect(
              screen.getByRole("heading", {
                name: /delete folder/i,
              })
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /close/i,
              })
            ).toBeInTheDocument();
            expect(
              screen.getByText(
                "Are you sure you want to delete this folder? This folder, and any Chart Strings within it will be removed."
              )
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /cancel/i,
              })
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /delete/i,
              })
            ).toBeInTheDocument();
          });
        });
        it("closes dialog box when cancel is clicked", async () => {
          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.getByRole("button", {
                name: /delete folder/i,
              })
            ).toBeInTheDocument();
          });
          const deleteButton = screen.getByRole("button", {
            name: /delete folder/i,
          });
          await user.click(deleteButton);

          //Verify dialog box is open
          await waitFor(() => {
            expect(
              screen.getByText(
                "Are you sure you want to delete this folder? This folder, and any Chart Strings within it will be removed."
              )
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /cancel/i,
              })
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /delete/i,
              })
            ).toBeInTheDocument();
          });

          const cancelButton = screen.getByRole("button", {
            name: /cancel/i,
          });
          await user.click(cancelButton);
          await waitFor(() => {
            expect(
              screen.getByText(
                "Folder 13 description with Admin permission only"
              )
            ).toBeInTheDocument();
            expect(
              screen.queryByRole("heading", {
                name: /delete folder/i,
              })
            ).not.toBeInTheDocument();
            expect(
              screen.queryByText(
                "Are you sure you want to delete this folder? This folder, and any Chart Strings within it will be removed."
              )
            ).not.toBeInTheDocument();
          });
        });
        it("closes dialog box when close is clicked", async () => {
          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.getByRole("button", {
                name: /delete folder/i,
              })
            ).toBeInTheDocument();
          });
          const deleteButton = screen.getByRole("button", {
            name: /delete folder/i,
          });
          await user.click(deleteButton);

          //Verify dialog box is open
          await waitFor(() => {
            expect(
              screen.getByText(
                "Are you sure you want to delete this folder? This folder, and any Chart Strings within it will be removed."
              )
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /cancel/i,
              })
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /delete/i,
              })
            ).toBeInTheDocument();
          });

          const closeButton = screen.getByRole("button", {
            name: /close/i,
          });
          await user.click(closeButton);
          await waitFor(() => {
            expect(
              screen.getByText(
                "Folder 13 description with Admin permission only"
              )
            ).toBeInTheDocument();
            expect(
              screen.queryByRole("heading", {
                name: /delete folder/i,
              })
            ).not.toBeInTheDocument();
            expect(
              screen.queryByText(
                "Are you sure you want to delete this folder? This folder, and any Chart Strings within it will be removed."
              )
            ).not.toBeInTheDocument();
          });
        });
        it("deletes folder when delete is clicked", async () => {
          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.getByRole("button", {
                name: /delete folder/i,
              })
            ).toBeInTheDocument();
          });
          const deleteButton = screen.getByRole("button", {
            name: /delete folder/i,
          });
          await user.click(deleteButton);

          //Verify dialog box is open
          await waitFor(() => {
            expect(
              screen.getByText(
                "Are you sure you want to delete this folder? This folder, and any Chart Strings within it will be removed."
              )
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /cancel/i,
              })
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /delete/i,
              })
            ).toBeInTheDocument();
          });

          const deleteFolderButton = screen.getByRole("button", {
            name: /delete/i,
          });
          await user.click(deleteFolderButton);
          await waitFor(() => {
            expect(addFinToast).toBeCalledWith(
              "success",
              "Folder deleted successfully."
            );

            expect(screen.getByText("Redirected to teams")).toBeInTheDocument();
          });
        });
      });
      describe("can't delete folder", () => {
        it("generates an error toast when delete folder fails", async () => {
          //this one needs to be moved outside the describe block because it uses a different folder
          const teamId = "0";
          const folderId = "999"; // error testing
          const user = userEvent.setup();

          render(wrappedView(teamId, folderId));
          await waitFor(() => {
            expect(
              screen.getByRole("button", { name: /actions/i })
            ).toBeInTheDocument();
            // expect(
            //   screen.getByText("Folder 13 description with Admin permission only")
            // ).toBeInTheDocument();
          });

          const button = screen.getByRole("button", { name: /actions/i });
          await user.click(button);

          await waitFor(() => {
            expect(
              screen.getByRole("button", {
                name: /delete folder/i,
              })
            ).toBeInTheDocument();
          });
          const deleteButton = screen.getByRole("button", {
            name: /delete folder/i,
          });
          await user.click(deleteButton);

          //Verify dialog box is open
          await waitFor(() => {
            expect(
              screen.getByText(
                "Are you sure you want to delete this folder? This folder, and any Chart Strings within it will be removed."
              )
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /cancel/i,
              })
            ).toBeInTheDocument();
            expect(
              screen.getByRole("button", {
                name: /delete/i,
              })
            ).toBeInTheDocument();
          });

          const deleteFolderButton = screen.getByRole("button", {
            name: /delete/i,
          });
          await user.click(deleteFolderButton);
          await waitFor(() => {
            expect(addFinToast).toBeCalledWith(
              "error",
              "Error deleting folder."
            );
          });
        });
      });
    });
  });
});

const wrappedView = (teamId: string, folderId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/folders/${folderId}`]}>
      <Routes>
        <Route path="/teams/:teamId/folders/:folderId" element={<Folder />} />
        <Route
          path="/teams/:teamId/folders/:folderId/admins"
          element={<div>Redirected to folder admins</div>}
        />
        <Route
          path="/teams/:teamId/folders/:folderId/entry"
          element={<div>Redirected to new chart string page</div>}
        />
        <Route
          path="/teams/:teamId/folders/:folderId/permissions"
          element={<div>Redirected to manage permissions</div>}
        />
        <Route
          path="/teams/:teamId/folders/:folderId/edit"
          element={<div>Redirected to edit folder</div>}
        />
        <Route path="/teams/" element={<div>Redirected to teams</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
