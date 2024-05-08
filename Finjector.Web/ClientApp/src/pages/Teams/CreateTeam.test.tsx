import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { server } from "../../../test/mocks/node";
import CreateTeam from "./CreateTeam";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";
import userEvent from "@testing-library/user-event";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CreateTeam tests", () => {
  describe("renders", () => {
    beforeEach(() => {
      render(wrappedView());
    });
    it("renders", () => {
      expect(screen.getAllByText("Create New Team")[0]).toBeInTheDocument();
    });
    it("renders the page title", () => {
      expect(
        screen.getByRole("heading", {
          name: /create new team/i,
        })
      ).toBeInTheDocument();
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
    it("renders the name input field", () => {
      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });

      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue("");
      expect(nameInput).toBeEnabled();
    });
    it("renders the description input field", () => {
      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });

      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).toHaveValue("");
      expect(descriptionInput).toBeEnabled();
    });

    it("renders the save button", () => {
      const saveButton = screen.getByRole("button", {
        name: /create new team/i,
      });

      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();
    });
  });
  describe("actions", () => {
    beforeEach(() => {
      vi.mock("../../components/Shared/LoadingAndErrors/FinToast", () => ({
        default: vi.fn(),
      }));

      render(wrappedView());
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("should show error toast when team creation fails", async () => {
      const user = userEvent.setup();
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
          name: /create new team/i,
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
        name: /create new team/i,
      });
      await user.type(nameInput, "Personal"); //this will trigger an error. See mocks/handlers.ts But also in the API if it is called
      await user.type(descriptionInput, "Test Description");

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("Personal");

        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("Test Description");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith("error", "Error creating team.");
      });
    });
    it("should show success toast when team is created", async () => {
      const user = userEvent.setup();
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
          name: /create new team/i,
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
        name: /create new team/i,
      });
      await user.type(nameInput, "Test Team");
      await user.type(descriptionInput, "Test Description");

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("Test Team");

        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("Test Description");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith(
          "success",
          "Team created successfully."
        );
        expect(screen.getByText("It Redirected Yay!")).toBeInTheDocument();
      });
    });
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/create`]}>
      <Routes>
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams" element={<div>It Redirected Yay!</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
