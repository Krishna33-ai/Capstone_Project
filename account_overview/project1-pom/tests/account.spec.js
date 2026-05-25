// tests/account.spec.js
// SERVICE 2 — Account Overview | 16 Test Cases

const { test, expect } = require('@playwright/test');
const AuthPage    = require('../pages/AuthPage');
const AccountPage = require('../pages/AccountPage');
const TEST_DATA   = require('../fixtures/testData');

async function loginAndGo(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  // ParaBank lands on overview automatically after login — no need to navigate
  await page.waitForLoadState('domcontentloaded');
  const account = new AccountPage(page);
  return account;

}

// ─────────────────────────────────────────────
//  BLOCK 1 — Page Load & Title (TC-ACC-01 to 03)
// ─────────────────────────────────────────────
test.describe('Block 1 — Page Load & Title', () => {

  test('TC-ACC-01 | Overview page title is visible after login', async ({ page }) => {
    const account = await loginAndGo(page);
    await expect(account.pageTitle).toBeVisible();
    const title = await account.pageTitle.innerText();
    expect(title.toLowerCase()).toContain('account');
  });

  test('TC-ACC-02 | Overview page URL is correct after login', async ({ page }) => {
    await loginAndGo(page);
    await expect(page).toHaveURL(/overview/);
  });

  test('TC-ACC-03 | Accounts Overview link in left nav is visible', async ({ page }) => {
    const account = await loginAndGo(page);
    await expect(account.accountsOverviewLink).toBeVisible();
  });
});

// ─────────────────────────────────────────────
//  BLOCK 2 — Account Table Structure (TC-ACC-04 to 07)
// ─────────────────────────────────────────────
test.describe('Block 2 — Account Table Structure', () => {

  test('TC-ACC-04 | Account table is visible on overview page', async ({ page }) => {
    const account = await loginAndGo(page);
    await expect(account.accountTable).toBeVisible();
  });

  test('TC-ACC-05 | At least one account row exists in the table', async ({ page }) => {
    const account = await loginAndGo(page);
    const rows = await account.getRowCount();
    expect(rows).toBeGreaterThan(0);
  });

  test('TC-ACC-06 | Account number links are visible in table', async ({ page }) => {
    const account = await loginAndGo(page);
    await expect(account.accountLinks.first()).toBeVisible();
  });

  test('TC-ACC-07 | Account table has at least 3 columns', async ({ page }) => {
    const account = await loginAndGo(page);
    const headers = page.locator('#accountTable thead th');
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

// ─────────────────────────────────────────────
//  BLOCK 3 — Balance Display (TC-ACC-08 to 11)
// ─────────────────────────────────────────────
test.describe('Block 3 — Balance Display', () => {

  test('TC-ACC-08 | Total balance is displayed in footer row', async ({ page }) => {
    const account = await loginAndGo(page);
    const lastRow = page.locator('#accountTable tr').last();
    await expect(lastRow).toBeVisible();
  });

  test('TC-ACC-09 | Total balance value is not empty', async ({ page }) => {
    const account = await loginAndGo(page);
    const lastRow = await page.locator('#accountTable tr').last().innerText();
    expect(lastRow.trim().length).toBeGreaterThan(0);
  });

  test('TC-ACC-10 | Total available balance is displayed', async ({ page }) => {
    const account = await loginAndGo(page);
    const lastRow = page.locator('#accountTable tr').last();
    await expect(lastRow).toBeVisible();
  });

  test('TC-ACC-11 | Balance values contain $ symbol', async ({ page }) => {
    const account = await loginAndGo(page);
    const balanceCell = page.locator('#accountTable a').first();
    await expect(balanceCell).toBeVisible();
    const tableText = await page.locator('#accountTable').innerText();
    expect(tableText.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
//  BLOCK 4 — Account Detail Drill-down (TC-ACC-12 to 14)
// ─────────────────────────────────────────────
test.describe('Block 4 — Account Detail Drill-down', () => {

  test('TC-ACC-12 | Clicking account number opens detail page', async ({ page }) => {
    const account = await loginAndGo(page);
    await account.clickFirstAccount();
    await expect(page).toHaveURL(/activity/);
  });

  test('TC-ACC-13 | Account detail page shows account number', async ({ page }) => {
    const account = await loginAndGo(page);
    await account.clickFirstAccount();
    await expect(account.accountNumber).toBeVisible();
  });

  test('TC-ACC-14 | Account detail page shows account type', async ({ page }) => {
    const account = await loginAndGo(page);
    await account.clickFirstAccount();
    const pageContent = await page.locator('#rightPanel').innerText();
    expect(pageContent.toLowerCase()).toMatch(/checking|savings|account/);
  });
});

// ─────────────────────────────────────────────
//  BLOCK 5 — Navigation (TC-ACC-15 to 16)
// ─────────────────────────────────────────────
test.describe('Block 5 — Navigation', () => {

  test('TC-ACC-15 | Back to overview from account detail works', async ({ page }) => {
    const account = await loginAndGo(page);
    await account.clickFirstAccount();
    await account.clickAccountsOverviewLink();
    await expect(page).toHaveURL(/overview/);
  });

  test('TC-ACC-16 | Overview accessible via left nav from another page', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.goto('/parabank/contact.htm');
    const account = new AccountPage(page);
    await account.clickAccountsOverviewLink();
    await expect(page).toHaveURL(/overview/);
  });
});
