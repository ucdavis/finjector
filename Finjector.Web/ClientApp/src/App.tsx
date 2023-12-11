import React from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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

function App() {
  const userInfoQuery = useUserInfoQuery();

  // wait until we get user info to render
  if (userInfoQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/example" element={<Example />} />
          <Route path="/about" element={<About />} />
          <Route path="/landing" element={<RedirectHome />} />
          <Route
            path="/locator/:type/:id"
            element={<ChartStringRedirector />}
          />
          <Route path="/teams">
            <Route path="" element={<MyTeams />} />
            <Route path="create" element={<CreateTeam />} />
            <Route path=":id" element={<Team />} />
            <Route path=":id/edit" element={<EditTeam />} />
            <Route path=":id/folders" element={<Team />} />
            <Route path=":id/folders/create" element={<CreateFolder />} />
            <Route path=":id/folders/:folderId" element={<Folder />} />
            <Route path=":id/folders/:folderId/edit" element={<EditFolder />} />
            <Route path=":id/permissions" element={<UserManagement />} />
            <Route
              path=":id/folders/:folderId/permissions"
              element={<UserManagement />}
            />
            <Route path=":id/admins" element={<AdminList />} />
            <Route
              path=":id/folders/:folderId/admins"
              element={<AdminList />}
            />
          </Route>
          <Route path="/entry">
            <Route path="" element={<Entry />} />
            <Route path=":chartSegmentString" element={<Entry />} />
            <Route path=":id/:chartSegmentString" element={<Entry />} />
          </Route>
          <Route path="/details">
            <Route path=":chartSegmentString" element={<Details />} />
            <Route path=":id/:chartSegmentString" element={<Details />} />
          </Route>
          <Route path="/paste" element={<Paste />} />
          <Route path="/selected">
            <Route path="" element={<RedirectHome />} />
            <Route path=":chart" element={<Selected />} />
            <Route path=":id/:chart" element={<Selected />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const RedirectHome = () => <Navigate to="/" />;

export default App;
