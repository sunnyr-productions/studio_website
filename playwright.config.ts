import { defineConfig } from "@playwright/test";

// Smoke tests run against a production build (`next build` first), on a port
// that won't collide with `next dev`.
const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
