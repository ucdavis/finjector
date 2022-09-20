import React from 'react';
import logo from './logo.svg';
import './App.css';

// TODO: if cal wants sass, replace this
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // TODO: move to helper or make it a conditional route
  // We need to check for the existance of a specific cookie to ensure the user is logged in
  // If they are not logged in, we need to redirect them to the login page
  const cookies = document.cookie;

  if (cookies.split(';').some(c => c.trim() === 'ASPNET_AUTH_SESSION=true')) {
    // we have a valid cookie, so we can render the app
  } else {
    // we don't have a valid cookie, so we need to redirect to the login page
    window.location.href = '/account/login';
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to F(inancial) Injector!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
