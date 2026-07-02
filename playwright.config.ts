import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3007",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev -- --port 3007",
    url: "http://localhost:3007",
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 7"] }
    },
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
