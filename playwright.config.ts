import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './test/playwright',

  fullyParallel: false,
  workers: 1,

  use: {
    baseURL: 'https://privatepools-frontend-git-dev-dark-pools-team.vercel.app', 
    trace: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  retries: 1,
  globalTimeout: 1200_000,
  timeout: 1200_000,
});