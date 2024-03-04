/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { certFilePath, keyFilePath } from "./aspnetcore-https.js";
import tsconfigPaths from "vite-tsconfig-paths";

const proxySettings = {
  target: "https://localhost:7256/",
  changeOrigin: false,
  secure: false,
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    root: __dirname,
    setupFiles: "./vitest.setup.ts",
    environmentMatchGlobs: [
      // all tests will run in jsdom
      ["src/**", "jsdom"],
    ],
  },
  server: {
    https: {
      key: readFileSync(keyFilePath),
      cert: readFileSync(certFilePath),
    },
    port: 3000,
    strictPort: true,
    proxy: {
      "/weatherforecast": { ...proxySettings },
      "/account/login": { ...proxySettings },
      "/api": { ...proxySettings },
      "/signin-oidc": { ...proxySettings },
      "/signout-oidc": { ...proxySettings },
      "/signout-callback-oidc": { ...proxySettings },
      "/system": { ...proxySettings },
    },
  },
});
