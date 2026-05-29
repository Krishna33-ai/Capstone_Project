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
    this.loanLink          = page.locator('a[href*="requestloan"]');
  }

  async gotoLoan() {
    await this.navigate('/parabank/requestloan.htm');
    await this.page.waitForLoadState('domcontentloaded');
    // Same Angular bootstrap issue as bill pay — wait for first form field
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
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = LoanPage;
