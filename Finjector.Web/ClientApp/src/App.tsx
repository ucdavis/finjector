import React from "react";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import logo from "./logo.svg";

import { useUserInfoQuery } from "./queries/userQueries";
import Landing from "./pages/Landing";
import Selected from "./pages/Selected";
import Entry from "./pages/Entry";
import Paste from "./pages/Paste";
import Header from "./shared/Header";

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
          <Route path="/entry">
            <Route path="" element={<Entry />} />
            <Route path=":id/:chart" element={<Entry />} />
          </Route>
          <Route path="/paste" element={<Paste />} />
          <Route path="/selected/:id/:chart" element={<Selected />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function About() {
  const user = useUserInfoQuery();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {user.isSuccess &&
            user.data[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ]}
        </p>
        <p>
          This application was developed by the CAES Dean's Offic Computer
          Resource Unit! <hr />
          It uses the Aggie Enterprise Graph QL to build a COA from the campus
          data source
        </p>
        <Link className="App-link" to="/">
          Back home
        </Link>
        <hr />
        <a href="https://caeshelp.ucdavis.edu/?appname=Finjector">Help</a>
      </header>
    </div>
  );
}

export default App;
