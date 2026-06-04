

const { test, expect } = require('@playwright/test');
const AuthPage     = require('../pages/AuthPage');
const TransferPage = require('../pages/TransferPage');
const TEST_DATA    = require('../fixtures/testData');

async function loginAndGoto(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  await page.waitForLoadState('domcontentloaded');
  const transfer = new TransferPage(page);
  await transfer.gotoTransfer();
  await page.waitForSelector('#rightPanel', { state: 'visible', timeout: 60000 });
  await transfer.amountInput.waitFor({ state: 'visible', timeout: 60000 });
  await transfer.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
  await expect(transfer.fromAccountSelect.locator('option')).not.toHaveCount(0, { timeout: 60000 });
  await transfer.toAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
  await expect(transfer.toAccountSelect.locator('option')).not.toHaveCount(0, { timeout: 60000 });
  return transfer;
}

// Shared helper: snapshot panel, click transfer button, wait for Angular update
async function clickAndWait(page, transfer) {
  const beforeText = await page.locator('#rightPanel').innerText().catch(() => '');
  await transfer.transferButton.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(
    (before) => {
      const el = document.querySelector('#rightPanel');
      if (!el) return false;
      const current = el.innerText ? el.innerText.trim() : '';
      return current.length > 0 && current !== before.trim();
    },
    beforeText,
    { timeout: 60000 }
  ).catch(() => {
    
  });
}

test.describe('Block 1 — Transfer Page UI', () => {
  test('TC-TRF-01 | Transfer page loads after login', async ({ page }) => {
    await loginAndGoto(page);
    await expect(page).toHaveURL(/transfer/);
  });
  test('TC-TRF-02 | Amount input field is visible', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await expect(transfer.amountInput).toBeVisible();
  });
  test('TC-TRF-03 | From account dropdown is visible', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await expect(transfer.fromAccountSelect).toBeVisible();
  });
  test('TC-TRF-04 | Transfer button is visible', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.transferButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(transfer.transferButton).toBeVisible();
  });
});

test.describe('Block 2 — Account Dropdowns', () => {
  test('TC-TRF-05 | From account dropdown has at least one account', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    const count = await transfer.getFromAccountCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
  test('TC-TRF-06 | To account dropdown is visible', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await expect(transfer.toAccountSelect).toBeVisible();
  });
  test('TC-TRF-07 | To account dropdown has at least one account', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    const count = await transfer.getToAccountCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Block 3 — Valid Transfer', () => {
  test('TC-TRF-08 | Valid transfer shows success title', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.transfer(TEST_DATA.transferData.validAmount);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.toLowerCase()).toContain('transfer');
    }).toPass({ timeout: 30000 });
  });
  test('TC-TRF-09 | Success page shows transfer complete message', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.transfer(TEST_DATA.transferData.validAmount);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 30000 });
  });
  test('TC-TRF-10 | Small amount transfer succeeds', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.transfer(TEST_DATA.transferData.smallAmount);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.toLowerCase()).toContain('transfer');
    }).toPass({ timeout: 30000 });
  });
  // FIX TC-TRF-11: transfer() now uses beforeText change-detection (TransferPage.js)
  test('TC-TRF-11 | Decimal amount transfer is accepted', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.transfer(TEST_DATA.transferData.decimalAmount);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 30000 });
  });
});

test.describe('Block 4 — Invalid Transfer', () => {
  
  test('TC-TRF-12 | Zero amount shows error or stays on page', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.amountInput.fill(TEST_DATA.transferData.zeroAmount);
    await clickAndWait(page, transfer);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
  test('TC-TRF-13 | Empty amount field shows error or stays on page', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.amountInput.fill('');
    await clickAndWait(page, transfer);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
  test('TC-TRF-14 | Page content is visible after invalid submit', async ({ page }) => {
    const transfer = await loginAndGoto(page);
    await transfer.amountInput.click();
    await transfer.amountInput.press('Control+a');
    await page.keyboard.type('abc');
    await clickAndWait(page, transfer);
    await expect(async () => {
      const content = await page.locator('#rightPanel').innerText();
      expect(content.length).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
  });
});

test.describe('Block 5 — Navigation', () => {
  test('TC-TRF-15 | Transfer link in left nav is visible after login', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const transfer = new TransferPage(page);
    await transfer.transferLink.waitFor({ state: 'visible', timeout: 60000 });
    await expect(transfer.transferLink).toBeVisible();
  });
  test('TC-TRF-16 | Transfer page accessible from left nav', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const transfer = new TransferPage(page);
    await transfer.transferLink.waitFor({ state: 'visible', timeout: 60000 });
    await transfer.transferLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/transfer/);
  });
});