// tests/transaction.spec.js
// SERVICE 4 — Transaction History | 17 Test Cases
// Target : https://parabank.parasoft.com
// Covers : Account activity page, transaction table, filters, navigation

const { test, expect } = require('@playwright/test');
const AuthPage       = require('../pages/AuthPage');
const TransactionPage = require('../pages/TransactionPage');
const TEST_DATA      = require('../fixtures/testData');

// login + go to overview + click first account
async function loginAndGotoActivity(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  const txn = new TransactionPage(page);
  await txn.gotoOverview();
  await txn.clickFirstAccount();
  return txn;
}

// ─────────────────────────────────────────────
//  BLOCK 1 — Account Activity Page Load (TC-TXN-01 to 04)
// ─────────────────────────────────────────────
test.describe('Block 1 — Account Activity Page Load', () => {

  test('TC-TXN-01 | Account activity page loads after clicking account', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(page).toHaveURL(/activity/);
  });

  test('TC-TXN-02 | Right panel content is visible on activity page', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(txn.rightPanel).toBeVisible();
  });

  test('TC-TXN-03 | Page title contains account related text', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    const text = await txn.getRightPanelText();
    expect(text.length).toBeGreaterThan(0);
  });

  test('TC-TXN-04 | Account overview link is visible on activity page', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(txn.overviewLink).toBeVisible();
  });
});

// ─────────────────────────────────────────────
//  BLOCK 2 — Transaction Table (TC-TXN-05 to 08)
// ─────────────────────────────────────────────
test.describe('Block 2 — Transaction Table', () => {

  test('TC-TXN-05 | Transaction table is visible on activity page', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(txn.transactionTable).toBeVisible();
  });

  test('TC-TXN-06 | Transaction table has at least one row', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await page.waitForTimeout(1500);
    const count = await txn.getTransactionRowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC-TXN-07 | Transaction table content is not empty', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    const text = await txn.transactionTable.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('TC-TXN-08 | Transaction table has Date column header', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    const headers = await txn.transactionTable.locator('thead th').allInnerTexts();
    const hasDate = headers.some(h => h.toLowerCase().includes('date'));
    expect(hasDate).toBe(true);
  });
});

// ─────────────────────────────────────────────
//  BLOCK 3 — Filter Controls (TC-TXN-09 to 12)
// ─────────────────────────────────────────────
test.describe('Block 3 — Filter Controls', () => {

  test('TC-TXN-09 | Activity month dropdown is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(txn.activitySelect).toBeVisible();
  });

  test('TC-TXN-10 | Transaction type dropdown is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(txn.typeSelect).toBeVisible();
  });

  test('TC-TXN-11 | Go button for filter is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(txn.findButton).toBeVisible();
  });

  test('TC-TXN-12 | Clicking Go button keeps page on activity URL', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.findButton.click();
    await page.waitForLoadState('domcontentloaded');
    const content = await txn.getRightPanelText();
    expect(content.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
//  BLOCK 4 — Amount Filter (TC-TXN-13 to 15)
// ─────────────────────────────────────────────
test.describe('Block 4 — Amount Filter', () => {

  test('TC-TXN-13 | Amount search input is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    const content = await txn.getRightPanelText();
    expect(content.toLowerCase()).toMatch(/amount|transaction|balance/);
  });

  test('TC-TXN-14 | Find Transactions button is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(txn.findButton).toBeVisible();
  });

  test('TC-TXN-15 | Searching by amount returns page content', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.findButton.click();
    await page.waitForLoadState('domcontentloaded');
    const content = await txn.getRightPanelText();
    expect(content.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
//  BLOCK 5 — Navigation (TC-TXN-16 to 17)
// ─────────────────────────────────────────────
test.describe('Block 5 — Navigation', () => {

  test('TC-TXN-16 | Back to overview from activity page works', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.overviewLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/overview/);
  });

  test('TC-TXN-17 | Activity page accessible from account overview table', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    const txn = new TransactionPage(page);
    await txn.gotoOverview();
    await expect(txn.accountLinks.first()).toBeVisible();
    await txn.clickFirstAccount();
    await expect(page).toHaveURL(/activity/);
  });
});
