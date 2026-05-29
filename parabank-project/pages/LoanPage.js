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
    // FIX FOR TC-LOAN-14:
    // Use text-based selector as a fallback alongside href — the nav link text
    // is "Request Loan" and the href contains "requestloan". Using the text
    // selector is more reliable across Angular ng-href resolution timing.
    this.loanLink          = page.locator('a:has-text("Request Loan")');
  }

  async gotoLoan() {
    await this.navigate('/parabank/requestloan.htm');
    await this.page.waitForLoadState('domcontentloaded');
    // Angular bootstrap: wait for form field to confirm page is fully rendered
    await this.loanAmountInput.waitFor({ state: 'visible', timeout: 35000 });
  }

  async getFromAccountCount() {
    return await this.fromAccountSelect.locator('option').count();
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }

  async applyForLoan(amount, downPayment) {
    await this.loanAmountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);
    await this.applyButton.click();
    // FIX FOR TC-LOAN-13:
    // After clicking Apply Now with any amount (including 0/0), ParaBank
    // renders the result (approved/denied/error) via AngularJS asynchronously.
    // waitForLoadState('domcontentloaded') returns before Angular updates
    // #rightPanel. Waiting for #rightPanel to have non-empty text ensures
    // the result is present before the test assertion runs.
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForFunction(
      () => {
        const el = document.querySelector('#rightPanel');
        return el && el.innerText && el.innerText.trim().length > 0;
      },
      { timeout: 35000 }
    );
  }
}

module.exports = LoanPage;