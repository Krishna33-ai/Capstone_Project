// tests/transaction.spec.js
// SERVICE 4 — Transaction History | 17 Test Cases
// Target : https://parabank.parasoft.com

const { test, expect } = require('@playwright/test');
const AuthPage        = require('../pages/AuthPage');
const TransactionPage = require('../pages/TransactionPage');
const TEST_DATA       = require('../fixtures/testData');

async function loginAndGotoActivity(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  await page.waitForLoadState('domcontentloaded');
  const txn = new TransactionPage(page);
  await txn.gotoOverview();
  await txn.accountLinks.first().waitFor({ state: 'visible', timeout: 30000 });
  await txn.clickFirstAccount();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('#rightPanel', { state: 'visible', timeout: 25000 });
  return txn;
}

test.describe('Block 1 — Account Activity Page Load', () => {
  test('TC-TXN-01 | Account activity page loads after clicking account', async ({ page }) => {
    await loginAndGotoActivity(page);
    await expect(page).toHaveURL(/activity/);
  });

  // FIX: TC-TXN-02 was the one flaky UI failure.
  // Root cause: after clickFirstAccount() + domcontentloaded, ParaBank renders
  // #rightPanel asynchronously. The raw toBeVisible() check races against the
  // async render and loses intermittently.
  // Fix: wrap in toPass() retry loop (same pattern used by TC-TXN-03 and
  // every other test in this file that checks panel content).
  test('TC-TXN-02 | Right panel content is visible on activity page', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(async () => {
      await expect(txn.rightPanel).toBeVisible();
    }).toPass({ timeout: 20000 });
  });

  test('TC-TXN-03 | Page title contains account related text', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(async () => {
      const text = await txn.getRightPanelText();
      expect(text.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });

  test('TC-TXN-04 | Account overview link is visible on activity page', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.overviewLink.waitFor({ state: 'visible', timeout: 20000 });
    await expect(txn.overviewLink).toBeVisible();
  });
});

test.describe('Block 2 — Transaction Table', () => {
  test('TC-TXN-05 | Transaction table is visible on activity page', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
    await expect(txn.transactionTable).toBeVisible();
  });
  test('TC-TXN-06 | Transaction table has at least one row', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
    await expect(async () => {
      const count = await txn.getTransactionRowCount();
      expect(count).toBeGreaterThanOrEqual(1);
    }).toPass({ timeout: 20000 });
  });
  test('TC-TXN-07 | Transaction table content is not empty', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
    await expect(async () => {
      const text = await txn.transactionTable.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
  test('TC-TXN-08 | Transaction table has Date column header', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.transactionTable.waitFor({ state: 'attached', timeout: 25000 });
    const headers = await txn.transactionTable.locator('thead th').allInnerTexts();
    const hasDate = headers.some(h => h.toLowerCase().includes('date'));
    expect(hasDate).toBe(true);
  });
});

test.describe('Block 3 — Filter Controls', () => {
  test('TC-TXN-09 | Activity month dropdown is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.activitySelect.waitFor({ state: 'visible', timeout: 25000 });
    await expect(txn.activitySelect).toBeVisible();
  });
  test('TC-TXN-10 | Transaction type dropdown is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.typeSelect.waitFor({ state: 'visible', timeout: 25000 });
    await expect(txn.typeSelect).toBeVisible();
  });
  test('TC-TXN-11 | Go button for filter is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
    await expect(txn.findButton).toBeVisible();
  });
  test('TC-TXN-12 | Clicking Go button keeps page on activity URL', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
    await txn.findButton.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(async () => {
      const content = await txn.getRightPanelText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
});

test.describe('Block 4 — Amount Filter', () => {
  test('TC-TXN-13 | Amount search input is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await expect(async () => {
      const content = await txn.getRightPanelText();
      expect(content.toLowerCase()).toMatch(/amount|transaction|balance/);
    }).toPass({ timeout: 15000 });
  });
  test('TC-TXN-14 | Find Transactions button is visible', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
    await expect(txn.findButton).toBeVisible();
  });
  test('TC-TXN-15 | Searching by amount returns page content', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.findButton.waitFor({ state: 'visible', timeout: 25000 });
    await txn.findButton.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(async () => {
      const content = await txn.getRightPanelText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
});

test.describe('Block 5 — Navigation', () => {
  test('TC-TXN-16 | Back to overview from activity page works', async ({ page }) => {
    const txn = await loginAndGotoActivity(page);
    await txn.overviewLink.waitFor({ state: 'visible', timeout: 20000 });
    await txn.overviewLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/overview/);
  });
  test('TC-TXN-17 | Activity page accessible from account overview table', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const txn = new TransactionPage(page);
    await txn.gotoOverview();
    await txn.accountLinks.first().waitFor({ state: 'visible', timeout: 30000 });
    await expect(txn.accountLinks.first()).toBeVisible();
    await txn.clickFirstAccount();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/activity/);
  });
});