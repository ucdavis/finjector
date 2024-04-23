import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { server } from "../../../test/mocks/node";
import EditTeam from "./EditTeam";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";
import userEvent from "@testing-library/user-event";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("EditTeam tests", () => {
  let teamNumber: string;
  beforeEach(async () => {
    teamNumber = "1";
    // render component
    render(wrappedView(teamNumber));
    await waitFor(() => {
      expect(screen.getByText(`Team ${teamNumber}`)).toBeInTheDocument();
    });
  });

  describe("render tests", () => {
    it("renders", async () => {
      await waitFor(() => {
        expect(screen.getByText("Edit Team")).toBeInTheDocument();
      });
    });
    it("renders the team name", async () => {
      await waitFor(() => {
        expect(screen.getByText(`Team ${teamNumber}`)).toBeInTheDocument();
      });
    });
    it("renders the team description", async () => {
      await waitFor(() => {
        expect(
          screen.getByText(`Team ${teamNumber} description`)
        ).toBeInTheDocument();
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
    it("renders the name input field", () => {
      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });

      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue(`Team ${teamNumber}`);
      expect(nameInput).toBeEnabled();
    });
    it("renders the description input field", () => {
      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });

      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).toHaveValue(`Team ${teamNumber} description`);
      expect(descriptionInput).toBeEnabled();
    });

    it("renders the save button", () => {
      const saveButton = screen.getByRole("button", { name: /save/i });

      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();
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

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();
        expect(nameInput).toHaveValue(`Team ${teamNumber}`);

        const descriptionInput = screen.getByRole("textbox", {
          name: /description:/i,
        });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toBeEnabled();

        const saveButton = screen.getByRole("button", {
          name: /save changes/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
      });

      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });
      const saveButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      await user.clear(nameInput);
      await user.type(nameInput, "TEST ERROR");

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("TEST ERROR");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith("error", "Error updating team.");
        expect(
          screen.queryByText("It Redirected Yay!")
        ).not.toBeInTheDocument();
      });
    });
    it("doesn't save if the team name is empty", async () => {
      const user = userEvent.setup();

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();
        expect(nameInput).toHaveValue(`Team ${teamNumber}`);

        const descriptionInput = screen.getByRole("textbox", {
          name: /description:/i,
        });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toBeEnabled();

        const saveButton = screen.getByRole("button", {
          name: /save changes/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
      });

      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });
      const saveButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      await user.clear(nameInput);

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledTimes(0);
        expect(
          screen.queryByText("It Redirected Yay!")
        ).not.toBeInTheDocument();
      });
    });
    it("saves the team", async () => {
      const user = userEvent.setup();

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();
        expect(nameInput).toHaveValue(`Team ${teamNumber}`);

        const descriptionInput = screen.getByRole("textbox", {
          name: /description:/i,
        });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toBeEnabled();

        const saveButton = screen.getByRole("button", {
          name: /save changes/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
      });

      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });
      const saveButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      await user.clear(nameInput);
      await user.type(nameInput, "Test Team");

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("Test Team");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith(
          "success",
          "Team updated successfully."
        );
        expect(screen.getByText("It Redirected Yay!")).toBeInTheDocument();
      });
    });
    it("saves the team with an empty description", async () => {
      const user = userEvent.setup();

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();
        expect(nameInput).toHaveValue(`Team ${teamNumber}`);

        const descriptionInput = screen.getByRole("textbox", {
          name: /description:/i,
        });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toBeEnabled();

        const saveButton = screen.getByRole("button", {
          name: /save changes/i,
        });

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
      });

      const nameInput = screen.getByRole("textbox", {
        name: /name:/i,
      });
      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });
      const saveButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      await user.clear(descriptionInput);

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();

        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith(
          "success",
          "Team updated successfully."
        );
        expect(screen.getByText("It Redirected Yay!")).toBeInTheDocument();
      });
    });
  });
});

const wrappedView = (teamId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/edit`]}>
      <Routes>
        <Route path="/teams/:teamId/edit" element={<EditTeam />} />
        <Route path="/teams/:teamId" element={<div>It Redirected Yay!</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
