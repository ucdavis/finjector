import React from "react";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import logo from "./logo.svg";

import { useUserInfoQuery } from "./queries/userQueries";
import PopupTest from "./pages/PopupTest";
import Selection from "./pages/Selection";
import Landing from "./pages/Landing";
import Selected from "./pages/Selected";
import Entry from "./pages/Entry";
import Paste from "./pages/Paste";

function App() {
  const userInfoQuery = useUserInfoQuery();

  // wait until we get user info to render
  if (userInfoQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/popuptest" element={<PopupTest />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/entry">
            <Route path="" element={<Entry />} />
            <Route path=":id/:chart" element={<Entry />} />
          </Route>
          <Route path="/paste" element={<Paste />} />
          <Route path="/selected/:id/:chart" element={<Selected />} />
        </Routes>
      </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <p>Welcome to F(inancial) Injector!</p>
      <Link to="/popuptest">Click here for a sample finjection page!</Link>
    </div>
  );
}

function About() {
  const user = useUserInfoQuery();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Sample About page!{" "}
          {user.isSuccess &&
            user.data[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ]}
        </p>
        <Link className="App-link" to="/">
          Back home
        </Link>
      </header>
    </div>
  );
}

export default App;
