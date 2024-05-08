import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { server } from "../../../test/mocks/node";
import EditFolder from "./EditFolder";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";
import userEvent from "@testing-library/user-event";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("EditFolder tests", () => {
  let teamNumber: string;
  let folderNumber: string;
  beforeEach(async () => {
    teamNumber = "0";
    folderNumber = "2";
    // render component
    render(wrappedView(teamNumber, folderNumber));
    await waitFor(() => {
      expect(screen.getByText(/Edit Folder/i)).toBeInTheDocument();
    });
  });
  describe("render tests", () => {
    it("renders", async () => {
      await waitFor(() => {
        expect(screen.getByText(/Edit Folder/i)).toBeInTheDocument();
      });
    });
    it("renders the team and folder name", async () => {
      await waitFor(() => {
        expect(
          screen.getByText(`Team ${teamNumber} / Folder ${folderNumber}`)
        ).toBeInTheDocument();
      });
    });
    it("renders the edit folder title", async () => {
      await waitFor(() => {
        expect(screen.getByText(/Edit Folder/i)).toBeInTheDocument();
      });
    });

    it("renders the folder description", async () => {
      await waitFor(() => {
        expect(
          screen.getByText(`Folder ${folderNumber} description`)
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
      expect(nameInput).toHaveValue(`Folder ${folderNumber}`);
      expect(nameInput).toBeEnabled();
    });
    it("renders the description input field", () => {
      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });

      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).toHaveValue(
        `Folder ${folderNumber} description`
      );
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
        expect(nameInput).toHaveValue(`Folder ${folderNumber}`);

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
        expect(addFinToast).toBeCalledWith("error", "Error updating folder.");
        expect(
          screen.queryByText("It Redirected Yay!")
        ).not.toBeInTheDocument();
      });
    });

    it("does not save the folder if the name is empty", async () => {
      const user = userEvent.setup();

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();
        expect(nameInput).toHaveValue(`Folder ${folderNumber}`);

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

    it("saves the folder", async () => {
      const user = userEvent.setup();

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();
        expect(nameInput).toHaveValue(`Folder ${folderNumber}`);

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
      await user.type(nameInput, "Test Folder");

      await waitFor(() => {
        //expect name and description to be populated
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue("Test Folder");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith(
          "success",
          "Folder updated successfully."
        );
        expect(screen.getByText("It Redirected Yay!")).toBeInTheDocument();
      });
    });
    it("saves the folder with an empty description", async () => {
      const user = userEvent.setup();

      //Verify fields are available and enabled
      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", {
          name: /name:/i,
        });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toBeEnabled();
        expect(nameInput).toHaveValue(`Folder ${folderNumber}`);

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

      const descriptionInput = screen.getByRole("textbox", {
        name: /description:/i,
      });
      const saveButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      await user.clear(descriptionInput);

      await waitFor(() => {
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("");
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(addFinToast).toBeCalledWith(
          "success",
          "Folder updated successfully."
        );
        expect(screen.getByText("It Redirected Yay!")).toBeInTheDocument();
      });
    });
  });
});

const wrappedView = (teamId: string, folderId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter
      initialEntries={[`/teams/${teamId}/folders/${folderId}/edit`]}
    >
      <Routes>
        <Route
          path="/teams/:teamId/folders/:folderId/edit"
          element={<EditFolder />}
        />
        <Route
          path="/teams/:teamId/folders/:folderId"
          element={<div>It Redirected Yay!</div>}
        />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
