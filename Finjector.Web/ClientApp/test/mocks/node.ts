import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// Uncomment the following sections in order to see what api calls
// are being made during testing...

// View mocked requests that have been mapped
// server.events.on("request:start", ({ request }) => {
//   console.log("MSW intercepted:", request.method, request.url);
// });

// View mocked requests that have not been mapped
// server.events.on("request:unhandled", ({ request }) => {
//   console.log("MSW unhandled:", request.method, request.url);
// });
