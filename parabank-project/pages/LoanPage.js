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
    // ParaBank left nav renders links via AngularJS ng-href. The visible link
    // text is "Request Loan". Using both text and href selectors with .first()
    // ensures we match robustly even if Angular resolves ng-href slightly late.
    // The 'or' locator (pipe syntax) matches whichever resolves first.
    this.loanLink = page.locator(
      'a:has-text("Request Loan"), a[href*="requestloan"]'
    ).first();
  }

  async gotoLoan() {
    await this.navigate('/parabank/requestloan.htm');
    await this.page.waitForLoadState('domcontentloaded');
    // Angular bootstrap: wait for form field to confirm page is fully rendered
    await this.loanAmountInput.waitFor({ state: 'visible', timeout: 35000 });
    // Also wait for fromAccountSelect to have options (AJAX-populated)
    await this.fromAccountSelect.waitFor({ state: 'visible', timeout: 35000 });
  }

  async getFromAccountCount() {
    return await this.fromAccountSelect.locator('option').count();
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }

  // FIX TC-LOAN-13:
  // applyForLoan('0', '0') — the old waitForFunction checked that #rightPanel
  // innerText is non-empty, but #rightPanel ALREADY has non-empty content
  // (the loan request form itself). So the condition resolves instantly,
  // BEFORE Angular replaces the form with the loan result (approved/denied/error).
  //
  // Fix: snapshot the panel text before clicking Apply Now, then wait until
  // Angular replaces it with new content. This correctly handles all cases:
  // valid amounts (approved/denied), zero amounts (error/denied), and large amounts.
  async applyForLoan(amount, downPayment) {
    await this.loanAmountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);

    // Snapshot before state so we can detect Angular DOM update
    const beforeText = await this.rightPanel.innerText().catch(() => '');

    await this.applyButton.click();
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for Angular to replace #rightPanel content with the loan result.
    // The result always differs from the form text (it contains "Loan Request Processed",
    // "Approved", "Denied", or an error — none of which appear in the blank form).
    await this.page.waitForFunction(
      (before) => {
        const el = document.querySelector('#rightPanel');
        if (!el) return false;
        const current = el.innerText ? el.innerText.trim() : '';
        return current.length > 0 && current !== before.trim();
      },
      beforeText,
      { timeout: 40000 }
    );
  }
}

module.exports = LoanPage;