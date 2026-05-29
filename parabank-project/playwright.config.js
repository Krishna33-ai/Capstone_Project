// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  // BUG FIX: Playwright default testMatch only catches *.spec.js (dot-separated).
  // Explicitly include *_spec.js (underscore) so all test files are discovered.
  testMatch: ['**/*.spec.js', '**/*_spec.js'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 2,
  workers: 1,
  timeout: 90000,

  reporter: [
  ['list'],
  ['allure-playwright', { resultsDir: 'allure-results' }],  // resultsDir NOT outputFolder
],
testMatch: ['**/*.spec.js', '**/*_spec.js'],

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