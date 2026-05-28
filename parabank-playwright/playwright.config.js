// playwright.config.js
// Candidate: Siva

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  // Tests within a file run serially — prevents session collisions on parabank.
  // Files themselves are distributed across shards/workers by the shard flag.
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  // CI: 1 retry (covers parabank network blips).
  // Local: 2 retries (demo server is less stable interactively).
  retries: process.env.CI ? 1 : 2,

  // CI: 1 worker per shard — the shard matrix (3 shards × 3 browsers) already
  // creates 9 parallel jobs. Each job runs one browser serially so parabank
  // is never hit by more than 3 concurrent sessions (one per browser shard).
  // Local: 1 worker — keeps parabank from throttling during local runs.
  workers: 1,

  timeout: 90000,

  reporter: process.env.CI
    ? [['list'], ['allure-playwright', { outputFolder: 'allure-results' }]]
    : [['list'], ['allure-playwright', { outputFolder: 'allure-results' }]],

  use: {
    baseURL: 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 20000,
    navigationTimeout: 45000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});