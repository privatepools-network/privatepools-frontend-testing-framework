import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "test/e2e" directory, relative to this configuration file.
  testDir: './test/playwright',

  // Run all tests in parallel.
  fullyParallel: false,

  // Use half of the number of logical CPU cores for running tests in parallel.
  workers: 1,

  use: {
    baseURL: 'https://beta.privatepools.network//',
    trace: 'on',
  },

  // Synpress currently only supports Chromium, however, this will change in the future.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  retries: 1,
  webServer: {
    command: 'pnpm run serve',
    url: 'https://beta.privatepools.network//',
    reuseExistingServer: false,
    timeout: 1200_000,
  },
  globalTimeout: 1200_000,
  timeout: 1200_000,
})
