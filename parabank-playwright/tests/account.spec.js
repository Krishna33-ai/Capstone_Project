// tests/account.spec.js
// SERVICE 2 — Account Overview | 16 Test Cases
// Target : https://parabank.parasoft.com

const { test, expect } = require('@playwright/test');
const AuthPage    = require('../pages/AuthPage');
const AccountPage = require('../pages/AccountPage');
const TEST_DATA   = require('../fixtures/testData');

async function loginAndGoto(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  // domcontentloaded is used instead of networkidle — networkidle never resolves
  // on Chromium because parabank keeps background XHR connections alive.
  // Firefox and WebKit are even stricter: they can time out entirely.
  // We rely on waitForSelector to confirm the page is truly ready.
  await page.waitForLoadState('domcontentloaded');
  const account = new AccountPage(page);
  await page.waitForSelector('#accountTable', { state: 'visible', timeout: 30000 });
  return account;
}

test.describe('Block 1 — Page Load', () => {

  test('TC-ACCT-01 | Account overview page loads after login', async ({ page }) => {
    await loginAndGoto(page);
    await expect(page).toHaveURL(/overview/);
  });

  test('TC-ACCT-02 | Page title is visible', async ({ page }) => {
    const account = await loginAndGoto(page);
    await expect(account.pageTitle).toBeVisible();
  });

  test('TC-ACCT-03 | Account table is visible', async ({ page }) => {
    const account = await loginAndGoto(page);
    await expect(account.accountTable).toBeVisible();
  });

  test('TC-ACCT-04 | At least one account row is present', async ({ page }) => {
    const account = await loginAndGoto(page);
    const count = await account.getRowCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Block 2 — Account Links', () => {

  test('TC-ACCT-05 | Account links are visible in table', async ({ page }) => {
    const account = await loginAndGoto(page);
    await expect(account.accountLinks.first()).toBeVisible();
  });

  test('TC-ACCT-06 | Clicking first account navigates to activity page', async ({ page }) => {
    const account = await loginAndGoto(page);
    await account.clickFirstAccount();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/activity/);
  });

  test('TC-ACCT-07 | Account detail page shows account number', async ({ page }) => {
    const account = await loginAndGoto(page);
    await account.clickFirstAccount();
    await page.waitForSelector('#accountDetails', { state: 'visible', timeout: 20000 });
    await expect(account.accountNumber).toBeVisible();
  });

  test('TC-ACCT-08 | Account detail page shows balance', async ({ page }) => {
    const account = await loginAndGoto(page);
    await account.clickFirstAccount();
    await page.waitForSelector('#accountDetails', { state: 'visible', timeout: 20000 });
    await expect(account.accountBalance).toBeVisible();
  });
});

test.describe('Block 3 — Account Details', () => {

  test('TC-ACCT-09 | Account type is displayed', async ({ page }) => {
    const account = await loginAndGoto(page);
    await account.clickFirstAccount();
    await page.waitForSelector('#accountDetails', { state: 'visible', timeout: 20000 });
    await expect(account.accountType).toBeVisible();
  });

  test('TC-ACCT-10 | Available balance is displayed', async ({ page }) => {
    const account = await loginAndGoto(page);
    await account.clickFirstAccount();
    await page.waitForSelector('#accountDetails', { state: 'visible', timeout: 20000 });
    await expect(account.availableBalance).toBeVisible();
  });
});

test.describe('Block 4 — Navigation', () => {

  test('TC-ACCT-11 | Accounts Overview link is visible after login', async ({ page }) => {
    const account = await loginAndGoto(page);
    await expect(account.accountsOverviewLink).toBeVisible({ timeout: 15000 });
  });

  test('TC-ACCT-12 | Clicking overview link stays on overview page', async ({ page }) => {
    const account = await loginAndGoto(page);
    await account.clickAccountsOverviewLink();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/overview/);
  });

  test('TC-ACCT-13 | Back to overview from account detail works', async ({ page }) => {
    const account = await loginAndGoto(page);
    await account.clickFirstAccount();
    await page.waitForLoadState('domcontentloaded');
    await account.gotoOverview();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/overview/);
  });
});

test.describe('Block 5 — Table Content', () => {

  test('TC-ACCT-14 | Account table content is not empty', async ({ page }) => {
    const account = await loginAndGoto(page);
    const text = await account.accountTable.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('TC-ACCT-15 | Account table has header row', async ({ page }) => {
    const account = await loginAndGoto(page);
    const headers = await account.accountTable.locator('th').allInnerTexts();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('TC-ACCT-16 | Multiple accounts can exist in table', async ({ page }) => {
    const account = await loginAndGoto(page);
    const count = await account.getRowCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});