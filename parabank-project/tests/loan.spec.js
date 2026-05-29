// tests/loan.spec.js
// SERVICE 6 — Loan Request | 15 Test Cases

const { test, expect } = require('@playwright/test');
const AuthPage = require('../pages/AuthPage');
const LoanPage = require('../pages/LoanPage');
const TEST_DATA = require('../fixtures/testData');

// LoanPage.gotoLoan() now waits for Angular internally
async function loginAndGoto(page) {
  const auth = new AuthPage(page);
  await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
  await page.waitForLoadState('domcontentloaded');
  const loan = new LoanPage(page);
  await loan.gotoLoan();
  return loan;
}

async function waitForFromAccount(loan) {
  await loan.fromAccountSelect.waitFor({ state: 'visible', timeout: 25000 });
  await expect(loan.fromAccountSelect.locator('option')).not.toHaveCount(0, { timeout: 25000 });
}

test.describe('Block 1 — Page Load', () => {
  test('TC-LOAN-01 | Loan request page loads after login', async ({ page }) => {
    await loginAndGoto(page);
    await expect(page).toHaveURL(/requestloan/);
  });
  test('TC-LOAN-02 | Right panel is visible on loan page', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await expect(loan.rightPanel).toBeVisible();
  });
  test('TC-LOAN-03 | Loan page content contains relevant text', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await expect(async () => {
      expect((await loan.getRightPanelText()).toLowerCase()).toMatch(/loan|amount|payment/);
    }).toPass({ timeout: 15000 });
  });
});

test.describe('Block 2 — Form Fields', () => {
  test('TC-LOAN-04 | Loan amount input is visible', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await expect(loan.loanAmountInput).toBeVisible();
  });
  test('TC-LOAN-05 | Down payment input is visible', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await expect(loan.downPaymentInput).toBeVisible();
  });
  test('TC-LOAN-06 | From account dropdown is visible', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await loan.fromAccountSelect.waitFor({ state: 'visible', timeout: 25000 });
    await expect(loan.fromAccountSelect).toBeVisible();
  });
  test('TC-LOAN-07 | Apply Now button is visible', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await loan.applyButton.waitFor({ state: 'visible', timeout: 20000 });
    await expect(loan.applyButton).toBeVisible();
  });
});

test.describe('Block 3 — Account Dropdown', () => {
  test('TC-LOAN-08 | From account dropdown loads options', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await waitForFromAccount(loan);
    expect(await loan.getFromAccountCount()).toBeGreaterThanOrEqual(1);
  });
  test('TC-LOAN-09 | Loan amount input accepts numeric value', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await loan.loanAmountInput.fill(TEST_DATA.loanData.validAmount);
    expect(await loan.loanAmountInput.inputValue()).toBe(TEST_DATA.loanData.validAmount);
  });
});

test.describe('Block 4 — Loan Application', () => {
  test('TC-LOAN-10 | Applying for loan shows response', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await waitForFromAccount(loan);
    await loan.applyForLoan(TEST_DATA.loanData.validAmount, TEST_DATA.loanData.validDownPayment);
    await expect(async () => {
      expect((await loan.getRightPanelText()).length).toBeGreaterThan(0);
    }).toPass({ timeout: 25000 });
  });
  test('TC-LOAN-11 | Loan response contains loan related text', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await waitForFromAccount(loan);
    await loan.applyForLoan(TEST_DATA.loanData.validAmount, TEST_DATA.loanData.validDownPayment);
    await expect(async () => {
      expect((await loan.getRightPanelText()).toLowerCase()).toMatch(/loan|approved|denied|error/);
    }).toPass({ timeout: 25000 });
  });
  test('TC-LOAN-12 | Applying with large amount shows response', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await waitForFromAccount(loan);
    await loan.applyForLoan(TEST_DATA.loanData.largeAmount, TEST_DATA.loanData.largeDownPayment);
    await expect(async () => {
      expect((await loan.getRightPanelText()).length).toBeGreaterThan(0);
    }).toPass({ timeout: 25000 });
  });
  test('TC-LOAN-13 | Applying with zero amount shows response', async ({ page }) => {
    const loan = await loginAndGoto(page);
    await waitForFromAccount(loan);
    await loan.applyForLoan(TEST_DATA.loanData.zeroAmount, TEST_DATA.loanData.zeroDownPayment);
    await expect(async () => {
      expect((await loan.getRightPanelText()).length).toBeGreaterThan(0);
    }).toPass({ timeout: 25000 });
  });
});

test.describe('Block 5 — Navigation', () => {
  test('TC-LOAN-14 | Loan request link is visible in left nav', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const loan = new LoanPage(page);
    await loan.loanLink.waitFor({ state: 'visible', timeout: 25000 });
    await expect(loan.loanLink).toBeVisible();
  });
  test('TC-LOAN-15 | Loan page accessible via left nav link', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    await page.waitForLoadState('domcontentloaded');
    const loan = new LoanPage(page);
    await loan.loanLink.waitFor({ state: 'visible', timeout: 25000 });
    await loan.loanLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/requestloan/);
  });
});
