// tests/bill.spec.js
// SERVICE 5 — Bill Payment | 20 Test Cases (15 original + 5 new TC-BILL-16 to TC-BILL-20)

const { test, expect } = require('@playwright/test');
const AuthPage = require('../pages/AuthPage');
const BillPage = require('../pages/BillPage');
const TEST_DATA = require('../fixtures/testData');

// BillPage.gotoBillPay() waits for Angular + AJAX account options internally
async function loginAndGoto(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  await page.waitForLoadState('domcontentloaded');
  const bill = new BillPage(page);
  await bill.gotoBillPay();
  return bill;
}

async function waitForFromAccount(bill) {
  await bill.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
  await expect(bill.fromAccountSelect.locator('option')).not.toHaveCount(0, { timeout: 60000 });
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
    }).toPass({ timeout: 20000 });
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
    await bill.sendButton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(bill.sendButton).toBeVisible();
  });
});

test.describe('Block 3 — From Account', () => {
  test('TC-BILL-09 | From account dropdown is visible', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
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
    }).toPass({ timeout: 30000 });
  });
  test('TC-BILL-12 | Payment response contains payment related text', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await waitForFromAccount(bill);
    await bill.fillPayeeDetails(TEST_DATA.payeeData);
    await bill.sendButton.click();
    await expect(async () => {
      expect((await bill.getRightPanelText()).toLowerCase()).toMatch(/payment|bill|complete|error/);
    }).toPass({ timeout: 30000 });
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
    await bill.billPayLink.waitFor({ state: 'visible', timeout: 60000 });
    await expect(bill.billPayLink).toBeVisible();
  });
  test('TC-BILL-15 | Bill pay page accessible via left nav link', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const bill = new BillPage(page);
    await bill.billPayLink.waitFor({ state: 'visible', timeout: 60000 });
    await bill.billPayLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/billpay/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Block 6 — Additional Safe Test Cases (TC-BILL-16 to TC-BILL-20)
// Pure client-side checks — no form submission, no async result rendering.
// Each test verifies DOM attributes or input behaviour only, making them
// reliable across all 3 browsers regardless of server speed.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 6 — Input Validation & UI State', () => {

  // TC-BILL-16: Verifies the payee name input accepts and retains a text value.
  // Safe: fill() + inputValue() is a pure in-browser check — no server call.
  test('TC-BILL-16 | Payee name input accepts and retains text value', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.payeeNameInput.fill(TEST_DATA.payeeData.name);
    const value = await bill.payeeNameInput.inputValue();
    expect(value).toBe(TEST_DATA.payeeData.name);
  });

  // TC-BILL-17: Verifies the amount input accepts and retains a numeric string.
  // Safe: fill() + inputValue() only — no form submission.
  test('TC-BILL-17 | Amount input accepts numeric value', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.amountInput.fill(TEST_DATA.payeeData.amount);
    const value = await bill.amountInput.inputValue();
    expect(value).toBe(TEST_DATA.payeeData.amount);
  });

  // TC-BILL-18: Verifies the fromAccountSelect is a proper <select> element
  // with the correct name attribute the server expects.
  // Safe: reads a DOM attribute — no side effects.
  test('TC-BILL-18 | From account dropdown has correct name attribute', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await waitForFromAccount(bill);
    const name = await bill.fromAccountSelect.getAttribute('name');
    expect(name).toBe('fromAccountId');
  });

  // TC-BILL-19: Verifies the account number input can be cleared and re-filled.
  // Safe: two sequential fill() calls — no form submission.
  test('TC-BILL-19 | Account number input can be cleared and re-entered', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.accountInput.fill(TEST_DATA.payeeData.account);
    await bill.accountInput.fill('');
    await bill.accountInput.fill('99999');
    const value = await bill.accountInput.inputValue();
    expect(value).toBe('99999');
  });

  // TC-BILL-20: Verifies the Send Payment button has the correct input type.
  // Safe: reads a DOM attribute — no navigation or server interaction.
  test('TC-BILL-20 | Send Payment button has correct input type', async ({ page }) => {
    const bill = await loginAndGoto(page);
    await bill.sendButton.waitFor({ state: 'visible', timeout: 60000 });
    const type = await bill.sendButton.getAttribute('type');
    // ParaBank renders the button as <input type="submit" value="Send Payment">
    expect(type).toBe('submit');
  });
});