import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { server } from "../../../test/mocks/node";
import CreateFolder from "./CreateFolder";
import userEvent from "@testing-library/user-event";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CreateFolder tests", () => {
  describe("render tests", () => {
    const teamId = "2";
    beforeEach(() => {
      render(wrappedView(teamId));
    });
    it("renders", async () => {
      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            name: /create new folder/i,
          })
        ).toBeInTheDocument();
        //console.log(screen.debug(undefined, 10000));
      });
    });
    it("renders the team name", async () => {
      await waitFor(() => {
        expect(screen.getByText(`Team ${teamId}`)).toBeInTheDocument();
      });
    });

    it("renders the name label", async () => {
      await waitFor(() => {
        expect(screen.getByText(/name:/i)).toBeInTheDocument();
      });
    });
    it("renders the description label", async () => {
      await waitFor(() => {
        expect(screen.getByText(/description:/i)).toBeInTheDocument();
      });
    });
    it("renders the name input field", async () => {
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });

        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("");
        expect(nameInput).toBeEnabled();
      });
    });
    it("renders the description input field", async () => {
      await waitFor(() => {
        const descriptionInput = screen.getByRole("textbox", {
          name: /description:/i,
        });

        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("");
        expect(descriptionInput).toBeEnabled();
      });
    });
    it("renders the save button", async () => {
      await waitFor(() => {
        const saveButton = screen.getByRole("button", {
          name: /create new folder/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
      });
    });
  });
  describe("action tests", () => {
    beforeEach(() => {
      vi.mock("../../components/Shared/LoadingAndErrors/FinToast", () => ({
        default: vi.fn(),
      }));
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("returns an error", async () => {
      const user = userEvent.setup();

      render(wrappedView("999")); //teamId 999 will return an error

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();

        const descriptionInput = screen.getByRole("textbox", {
          name: /description:/i,
        });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toBeEnabled();

        const saveButton = screen.getByRole("button", {
          name: /create new folder/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
      });

      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });
      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });
      const saveButton = screen.getByRole("button", {
        name: /create new folder/i,
      });
      await user.type(nameInput, "Test Folder");
      await user.type(descriptionInput, "Test Description");

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("Test Folder");

        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("Test Description");
      });

      await user.click(saveButton);

      await waitFor(() => {
        const saveButton = screen.getByRole("button", {
          name: /create new folder/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
        expect(
          screen.queryByText("It Redirected Yay!")
        ).not.toBeInTheDocument();
        expect(addFinToast).toBeCalledWith("error", "Error creating folder.");
      });
    });

    it("calls the save function when the save button is clicked", async () => {
      const user = userEvent.setup();

      render(wrappedView("2"));

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();

        const descriptionInput = screen.getByRole("textbox", {
          name: /description:/i,
        });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toBeEnabled();

        const saveButton = screen.getByRole("button", {
          name: /create new folder/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
      });

      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });
      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });
      const saveButton = screen.getByRole("button", {
        name: /create new folder/i,
      });
      await user.type(nameInput, "Test Folder");
      await user.type(descriptionInput, "Test Description");

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("Test Folder");

        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("Test Description");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith(
          "success",
          "Folder created successfully."
        );
        expect(screen.getByText("It Redirected Yay!")).toBeInTheDocument();
      });

      //console.log(screen.debug(undefined, 100000));
    });
  });
});

const wrappedView = (teamId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/folders/create`]}>
      <Routes>
        <Route
          path="/teams/:teamId/folders/create"
          element={<CreateFolder />}
        />
        <Route path="/teams/:teamId" element={<div>It Redirected Yay!</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
