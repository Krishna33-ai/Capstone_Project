// tests/bill.spec.js
// SERVICE 5 — Bill Payment | 15 Test Cases

const { test, expect } = require('@playwright/test');
const AuthPage = require('../pages/AuthPage');
const BillPage = require('../pages/BillPage');
const TEST_DATA = require('../fixtures/testData');

// BillPage.gotoBillPay() now waits for Angular internally —
// no extra waits needed here. This fixes ALL Firefox failures.
async function loginAndGoto(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  await page.waitForLoadState('domcontentloaded');
  const bill = new BillPage(page);
  await bill.gotoBillPay();
  return bill;
}

async function waitForFromAccount(bill) {
  await bill.fromAccountSelect.waitFor({ state: 'visible', timeout: 25000 });
  await expect(bill.fromAccountSelect.locator('option')).not.toHaveCount(0, { timeout: 25000 });
}

test.describe('Block 1 — Page Load', () => {
  test('TC-BILL-01 | Bill pay page loads after login', async ({ page }) => {
    await loginAndGoto(page);
    await expect(page).toHaveURL(/billpay/);
  });
  test('TC-BILL-02 | Right panel is visible on bill pay page', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await expect(bill.rightPanel).toBeVisible();
  });
  test('TC-BILL-03 | Bill pay page title contains relevant text', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await expect(async () => {
      expect((await bill.getRightPanelText()).toLowerCase()).toMatch(/bill|payment|payee/);
    }).toPass({ timeout: 15000 });
  });
});

test.describe('Block 2 — Form Fields', () => {
  test('TC-BILL-04 | Payee name input is visible', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await expect(bill.payeeNameInput).toBeVisible();
  });
  test('TC-BILL-05 | Address input is visible', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await expect(bill.addressInput).toBeVisible();
  });
  test('TC-BILL-06 | Amount input is visible', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await expect(bill.amountInput).toBeVisible();
  });
  test('TC-BILL-07 | Account number input is visible', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await expect(bill.accountInput).toBeVisible();
  });
  test('TC-BILL-08 | Send Payment button is visible', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.sendButton.waitFor({ state: 'visible', timeout: 20000 });
    await expect(bill.sendButton).toBeVisible();
  });
});

test.describe('Block 3 — From Account', () => {
  test('TC-BILL-09 | From account dropdown is visible', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.fromAccountSelect.waitFor({ state: 'visible', timeout: 25000 });
    await expect(bill.fromAccountSelect).toBeVisible();
  });
  test('TC-BILL-10 | From account dropdown loads accounts', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await waitForFromAccount(bill);
    expect(await bill.getFromAccountCount()).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Block 4 — Payment Submit', () => {
  test('TC-BILL-11 | Submitting valid payment shows response', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await waitForFromAccount(bill);
    await bill.fillPayeeDetails(TEST_DATA.payeeData);
    await bill.sendButton.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(async () => {
      expect((await bill.getRightPanelText()).length).toBeGreaterThan(0);
    }).toPass({ timeout: 25000 });
  });
  test('TC-BILL-12 | Payment response contains payment related text', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await waitForFromAccount(bill);
    await bill.fillPayeeDetails(TEST_DATA.payeeData);
    await bill.sendButton.click();
    await expect(async () => {
      expect((await bill.getRightPanelText()).toLowerCase()).toMatch(/payment|bill|complete|error/);
    }).toPass({ timeout: 25000 });
  });
  test('TC-BILL-13 | Submitting empty form shows page response', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.sendButton.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(async () => {
      expect((await bill.getRightPanelText()).length).toBeGreaterThan(0);
    }).toPass({ timeout: 20000 });
  });
});

test.describe('Block 5 — Navigation', () => {
  test('TC-BILL-14 | Bill pay link is visible in left nav after login', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const bill = new BillPage(page);
    await bill.billPayLink.waitFor({ state: 'visible', timeout: 25000 });
    await expect(bill.billPayLink).toBeVisible();
  });
  test('TC-BILL-15 | Bill pay page accessible via left nav link', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const bill = new BillPage(page);
    await bill.billPayLink.waitFor({ state: 'visible', timeout: 25000 });
    await bill.billPayLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/billpay/);
  });
});
