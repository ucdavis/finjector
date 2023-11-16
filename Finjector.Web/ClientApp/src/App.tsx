import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useUserInfoQuery } from "./queries/userQueries";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Selected from "./pages/Selected";
import Entry from "./pages/Entry";
import Paste from "./pages/Paste";
import Header from "./shared/Header";
import MyTeams from "./pages/Teams/MyTeams";

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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/teams" element={<MyTeams />} />
          <Route path="/entry">
            <Route path="" element={<Entry />} />
            <Route path=":chartSegmentString" element={<Entry />} />
            <Route path=":id/:chartSegmentString" element={<Entry />} />
          </Route>
          <Route path="/paste" element={<Paste />} />
          <Route path="/selected/:id/:chart" element={<Selected />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
