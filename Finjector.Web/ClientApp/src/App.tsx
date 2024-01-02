import React from "react";

import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { useUserInfoQuery } from "./queries/userQueries";
import Landing from "./pages/Landing";
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
import Breadcrumbs from "./shared/Breadcrumbs";
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
      { index: true, element: <Landing /> },
      { path: "/example", element: <Example /> },
      { path: "/help", element: <About /> },
      { path: "/landing", element: <RedirectHome /> },
      {
        path: "/locator/:type/:id",
        element: <ChartStringRedirector />,
      },
      {
        path: "/teams",
        children: [
          { index: true, element: <MyTeams /> },
          { path: "create", element: <CreateTeam /> },
          {
            path: ":teamId",
            children: [
              {
                index: true,
              },
              { path: "edit", element: <EditTeam /> },
              { path: "folders", element: <Team /> },
              { path: "folders/create", element: <CreateFolder /> },
              { path: "permissions", element: <UserManagement /> },
              { path: "admins", element: <AdminList /> },
              {
                path: "folders/:folderId",
                children: [
                  {
                    index: true,
                    element: <Folder />,
                  },
                  { path: "edit", element: <EditFolder /> },
                  {
                    path: "permissions",
                    element: <UserManagement />,
                  },
                  { path: "admins", element: <AdminList /> },
                  {
                    path: "details/:chartId/:chartSegmentString",
                    element: <Details />,
                    handle: {
                      title: "Chart String Detail",
                    },
                  },
                  {
                    path: "entry/:chartId/:chartSegmentString",
                    element: <Entry />,
                  },
                  {
                    path: "selected/:chartId/:chartSegmentString",
                    element: <Selected />,
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
          { index: true, element: <Entry /> },
          { path: ":chartSegmentString", element: <Entry /> },
        ],
      },
      {
        path: "/details",
        children: [{ path: ":chartSegmentString", element: <Details /> }],
      },
      { path: "/paste", element: <Paste /> },
      {
        path: "/selected",
        children: [
          { index: true, element: <RedirectHome /> },
          { path: ":chartSegmentString", element: <Selected /> },
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
