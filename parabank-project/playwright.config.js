// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  // Explicitly include both *.spec.js and *_spec.js patterns.
  // Only ONE testMatch — duplicate key was silently dropping the first pattern.
  testMatch: ['**/*.spec.js', '**/*_spec.js'],

  // ── Global setup ────────────────────────────────────────────────────────────
  // Hits ParaBank's initializeDB endpoint once before the whole suite.
  // This reseeds john/demo and all sample accounts so tests never fail
  // because the shared demo server was restarted between runs.
  globalSetup: require.resolve('./tests/global-setup'),

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 2,
  workers: 1,
  timeout: 90000,

  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

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
      use: {
        ...devices['Desktop Firefox'],
        actionTimeout:     25000,
        navigationTimeout: 55000,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        actionTimeout:     25000,
        navigationTimeout: 55000,
      },
    },
  ],
});
