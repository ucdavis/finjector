import React from "react";
import ReactDOM from "react-dom/client";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import * as Sentry from "@sentry/react";

import "./sass/main.scss";

Sentry.init({
  dsn: "https://971a200ce756ed1caf815a8d2cd6b743@o220035.ingest.sentry.io/4506543541649408",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: true,
    }),
  ],
  tracePropagationTargets: [/^https:\/\/finjector\.ucdavis\.edu/], // only log in production
  enabled: process.env.NODE_ENV !== "development", // don't log in dev
  // Performance Monitoring
  tracesSampleRate: 0.25, //  Capture only some of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
