// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  testMatch: ['**/*.spec.js'],

  globalSetup: require.resolve('./tests/global-setup'),

  fullyParallel: false,
  forbidOnly: !!process.env.CI,

  
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