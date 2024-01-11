import React from "react";

import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { useUserInfoQuery } from "./queries/userQueries";
import Landing from "./pages/Landing";
import Import from "./pages/Import";
import About from "./pages/About";
import Selected from "./pages/Selected";
import Entry from "./pages/Entry";
import Paste from "./pages/Paste";
import Details from "./pages/Details";
import Header from "./components/Shared/Header";
import MyTeams from "./pages/Teams/MyTeams";
import Team from "./pages/Teams/Team";
import Folder from "./pages/Teams/Folder";
import UserManagement from "./pages/Teams/UserManagement";
import CreateTeam from "./pages/Teams/CreateTeam";
import CreateFolder from "./pages/Teams/CreateFolder";
import AdminList from "./pages/Teams/AdminList";
import EditTeam from "./pages/Teams/EditTeam";
import EditFolder from "./pages/Teams/EditFolder";
import Breadcrumbs from "./components/Shared/Breadcrumbs";
import ChartStringRedirector from "./pages/ChartStringRedirector";
import Example from "./pages/Example";

const RedirectHome = () => <Navigate to="/" />;

function Layout() {
  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumbs />
        <Outlet />
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
        handle: { title: "", hideBreadcrumbs: true },
      },
      { path: "/example", element: <Example />, handle: { title: "Example" } },
      { path: "/help", element: <About />, handle: { title: "Help" } },
      { path: "/import", element: <Import />, handle: { title: "Import" } },
      {
        path: "/landing",
        element: <RedirectHome />,
        handle: { title: "Redirect Home" },
      },
      {
        path: "/locator/:type/:id",
        element: <ChartStringRedirector />,
        handle: { title: "Chart String Redirector" },
      },
      {
        path: "/teams",
        children: [
          { index: true, element: <MyTeams />, handle: { title: "My Teams" } },
          {
            path: "create",
            element: <CreateTeam />,
            handle: { title: "Create Team" },
          },
          {
            path: ":teamId",
            children: [
              {
                index: true,
                element: <Team />,
                handle: { title: "Team Details" },
              },
              {
                path: "edit",
                element: <EditTeam />,
                handle: { title: "Edit Team" },
              },
              {
                path: "folders",
                element: <Team />,
                handle: { title: "Team Details" },
              },
              {
                path: "folders/create",
                element: <CreateFolder />,
                handle: { title: "Create Folder" },
              },
              {
                path: "permissions",
                element: <UserManagement />,
                handle: { title: "User Management" },
              },
              {
                path: "admins",
                element: <AdminList />,
                handle: { title: "Admin List" },
              },
              {
                path: "folders/:folderId",
                children: [
                  {
                    index: true,
                    element: <Folder />,
                    handle: { title: "Folder Details" },
                  },
                  {
                    path: "edit",
                    element: <EditFolder />,
                    handle: { title: "Edit Folder" },
                  },
                  {
                    path: "permissions",
                    element: <UserManagement />,
                    handle: { title: "User Management" },
                  },
                  {
                    path: "admins",
                    element: <AdminList />,
                    handle: { title: "Admin List" },
                  },
                  {
                    path: "details/:chartId/:chartSegmentString",
                    element: <Details />,
                    handle: {
                      title: "Chart String Details",
                      hideBreadcrumbs: false,
                    },
                  },
                  {
                    path: "entry/:chartId/:chartSegmentString",
                    element: <Entry />,
                    handle: { title: "Entry", hideBreadcrumbs: true },
                  },
                  {
                    path: "selected/:chartId/:chartSegmentString",
                    element: <Selected />,
                    handle: { title: "Selected" },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/entry",
        children: [
          {
            index: true,
            element: <Entry />,
            handle: { title: "Entry", hideBreadcrumbs: true },
          },
          {
            path: ":chartSegmentString",
            element: <Entry />,
            handle: { title: "Entry", hideBreadcrumbs: true },
          },
        ],
      },
      {
        path: "/details",
        children: [
          {
            path: ":chartSegmentString",
            element: <Details />,
            handle: { title: "Details", hideBreadcrumbs: false },
          },
        ],
      },
      {
        path: "/paste",
        element: <Paste />,
        handle: { title: "Paste", hideBreadcrumbs: true },
      },
      {
        path: "/selected",
        children: [
          {
            index: true,
            element: <RedirectHome />,
            handle: { title: "Redirect Home" },
          },
          {
            path: ":chartSegmentString",
            element: <Selected />,
            handle: { title: "Selected" },
          },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" /> },
]);

function App() {
  const userInfoQuery = useUserInfoQuery();

  // wait until we get user info to render
  if (userInfoQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} />;
}

export default App;
