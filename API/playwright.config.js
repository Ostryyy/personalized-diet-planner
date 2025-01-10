import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:82",
  },
  globalSetup: "./global-setup.js",
  globalTeardown: "./global-teardown.js",
});
