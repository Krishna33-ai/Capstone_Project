// pages/LoanPage.js
const BasePage = require('./BasePage');

class LoanPage extends BasePage {
  constructor(page) {
    super(page);
    this.loanAmountInput   = page.locator('input[id="amount"]');
    this.downPaymentInput  = page.locator('input[id="downPayment"]');
    this.fromAccountSelect = page.locator('select[id="fromAccountId"]');
    this.applyButton       = page.locator('input[value="Apply Now"]');
    this.rightPanel        = page.locator('#rightPanel');

    // FIX TC-LOAN-14 & TC-LOAN-15:
    // ParaBank nav link text is "Request Loan". Combined selector with href
    // fallback handles Angular ng-href resolution timing across all browsers.
    // .first() prevents multiple-match errors.
    this.loanLink = page.locator(
      'a:has-text("Request Loan"), a[href*="requestloan"]'
    ).first();
  }

  async gotoLoan() {
    await this.navigate('/parabank/requestloan.htm');
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for Angular to render the loan form
    await this.loanAmountInput.waitFor({ state: 'visible', timeout: 60000 });

    // FIX TC-LOAN-03/04/05/06 (firefox): also wait for fromAccountSelect
    // and its AJAX-populated options before returning
    await this.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
    await this.page.waitForFunction(
      () => {
        const sel = document.querySelector('select[id="fromAccountId"]');
        return sel && sel.options && sel.options.length > 0;
      },
      { timeout: 60000 }
    );
  }

  async getFromAccountCount() {
    return await this.fromAccountSelect.locator('option').count();
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }

  // FIX TC-LOAN-13:
  // Snapshot #rightPanel BEFORE clicking so we can detect when Angular
  // replaces the form with the loan result (approved/denied/error).
  // The old waitForFunction checked innerText.length > 0 which resolved
  // instantly because the form itself has text — missing the actual result.
  async applyForLoan(amount, downPayment) {
    await this.loanAmountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);

    const beforeText = await this.rightPanel.innerText().catch(() => '');

    await this.applyButton.click();
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for Angular to replace #rightPanel content with loan result
    await this.page.waitForFunction(
      (before) => {
        const el = document.querySelector('#rightPanel');
        if (!el) return false;
        const current = el.innerText ? el.innerText.trim() : '';
        return current.length > 0 && current !== before.trim();
      },
      beforeText,
      { timeout: 60000 }
    );
  }
}

module.exports = LoanPage;