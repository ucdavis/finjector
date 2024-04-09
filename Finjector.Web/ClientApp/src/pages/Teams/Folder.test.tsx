import React from "react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { server } from "../../../test/mocks/node";
import Folder from "./Folder";
import userEvent from "@testing-library/user-event";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Folder", () => {
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
        expect(screen.getByText("Actions")).toBeInTheDocument();
      });
    });
  });
});

// describe("Folder", () => {
//   it("renders folder title and search bar", async () => {
//     (useParams as jest.Mock).mockReturnValue({
//       teamId: "99",
//       folderId: "123",
//     });

//     (useGetFolder as jest.Mock).mockReturnValue({
//       data: {
//         charts: [],
//         folder: {
//           id: "123",
//           name: "Folder 1",
//         },
//       },
//       isLoading: false,
//       isError: false,
//     });

//     render(
//       <QueryClientProvider client={new QueryClient()}>
//         <MemoryRouter initialEntries={["/teams/99/folders/123"]}>
//           <Routes>
//             <Route
//               path="/teams/:teamId/folders/:folderId"
//               element={<Folder />}
//             />
//           </Routes>
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     expect(screen.getByText("Folder 1")).toBeInTheDocument();
//     expect(
//       screen.getByPlaceholderText("Search Within Folder")
//     ).toBeInTheDocument();
//   });

//   it("renders chart list", async () => {
//     (useParams as jest.Mock).mockReturnValue({
//       teamId: "99",
//       folderId: "123",
//     });

//     (useGetFolder as jest.Mock).mockReturnValue({
//       data: {
//         charts: [
//           { id: "1", name: "Chart 1" },
//           { id: "2", name: "Chart 2" },
//         ],
//         folder: {
//           id: "123",
//           name: "Folder 1",
//         },
//       },
//       isLoading: false,
//       isError: false,
//     });

//     render(
//       <QueryClientProvider client={new QueryClient()}>
//         <MemoryRouter initialEntries={["/teams/99/folders/123"]}>
//           <Routes>
//             <Route
//               path="/teams/:teamId/folders/:folderId"
//               element={<Folder />}
//             />
//           </Routes>
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     await waitFor(() => {
//       expect(screen.getByText("Chart 1")).toBeInTheDocument();
//       expect(screen.getByText("Chart 2")).toBeInTheDocument();
//     });
//   });
// });

const wrappedView = (teamId: string, folderId: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[`/teams/${teamId}/folders/${folderId}`]}>
      <Routes>
        <Route path="/teams/:teamId/folders/:folderId" element={<Folder />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);
