import { defineConfig, devices } from "@playwright/test"
import { nxE2EPreset } from "@nx/playwright/preset"
import { workspaceRoot } from "@nx/devkit"

const baseURL = process.env["BASE_URL"] ?? "http://localhost:4200"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: "./src" }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  /* Run local dev server before starting the tests */
  webServer: {
    command: "npm run serve",
    url: "http://localhost:4200",
    reuseExistingServer: !process.env["CI"],
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
})