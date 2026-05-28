// pages/TransferPage.js
// Candidate: Siva

const BasePage = require('./BasePage');

class TransferPage extends BasePage {
  constructor(page) {
    super(page);

    this.amountInput       = page.locator('input[id="amount"]');
    this.fromAccountSelect = page.locator('select[id="fromAccountId"]');
    this.toAccountSelect   = page.locator('select[id="toAccountId"]');
    this.transferButton    = page.locator('input[value="Transfer"]');
    this.rightPanel        = page.locator('#rightPanel');
    this.transferLink      = page.locator('a[href*="transfer"]');
  }

  async gotoTransfer() {
    await this.navigate('/parabank/transfer.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getFromAccountCount() {
    return await this.fromAccountSelect.locator('option').count();
  }

  async getToAccountCount() {
    return await this.toAccountSelect.locator('option').count();
  }

  async transfer(amount) {
    await this.amountInput.fill(amount);
    await this.transferButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }
}

module.exports = TransferPage;
