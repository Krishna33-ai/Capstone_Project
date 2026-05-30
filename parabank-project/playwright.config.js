// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  testMatch: ['**/*.spec.js'],

  globalSetup: require.resolve('./tests/global-setup'),

  fullyParallel: false,
  forbidOnly: !!process.env.CI,

  // ROOT CAUSE FIX — retries:
  // ParaBank is a public shared server that is slow and intermittently
  // unavailable. In CI, retries: 1 meant a single flaky login (30-60 s
  // cold start) would permanently fail a test. Raising to 2 gives every
  // test two additional chances, which is sufficient for ParaBank's
  // observed failure patterns without inflating total run time significantly
  // (workers: 1 means retries are sequential, not parallel).
  retries: process.env.CI ? 2 : 1,
  workers: 1,

  // 3 minutes per test — generous for slow Angular pages + 2 retries
  timeout: 180000,

  reporter: [
    ['list'],
    ['allure-playwright', {
      resultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results',
    }],
  ],

  use: {
    baseURL: 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,

    // ROOT CAUSE FIX — actionTimeout:
    // 30 s was too low for ParaBank's shared server under CI load.
    // usernameInput.waitFor (and other element waits) were timing out
    // because ParaBank's servlet/JVM takes 30-60 s to serve the login
    // panel on a cold start. 60 s covers observed worst-case latencies.
    actionTimeout: 60000,
    navigationTimeout: 90000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        actionTimeout:     60000,
        navigationTimeout: 90000,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        actionTimeout:     60000,
        navigationTimeout: 90000,
      },
    },
  ],
});