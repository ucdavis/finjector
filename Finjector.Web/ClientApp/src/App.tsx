import React from "react";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";

// TODO: if cal wants sass, replace this
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserInfoQuery } from "./queries/userQueries";
import PopupTest from "./pages/PopupTest";
import Selection from "./pages/Selection";
import Landing from "./pages/Landing";
import Selected from "./pages/Selected";
import Entry from "./pages/Entry";
import Paste from "./pages/Paste";

const queryClient = new QueryClient();

function App() {
  // TODO: move to helper or make it a conditional route
  // We need to check for the existance of a specific cookie to ensure the user is logged in
  // If they are not logged in, we need to redirect them to the login page
  const cookies = document.cookie;

  if (cookies.split(";").some((c) => c.trim() === "ASPNET_AUTH_SESSION=true")) {
    // we have a valid cookie, so we can render the app
  } else {
    // we don't have a valid cookie, so we need to redirect to the login page
    window.location.href = "/account/login";
  }

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to F(inancial) Injector!</p>
        <Link className="App-link" to="/popuptest">
          Click here for a sample finjection page!
        </Link>
      </header>
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
