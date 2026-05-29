// pages/TransferPage.js

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
    // BUG FIX: transfer.htm is AngularJS — the form renders AFTER domcontentloaded.
    // Without this wait, amountInput and the dropdowns are not yet in the DOM,
    // causing TC-TRF-02/03/05/06/07 to fail on all browsers (especially Firefox).
    // Same fix already applied to BillPage, LoanPage, and ProfilePage.
    await this.amountInput.waitFor({ state: 'visible', timeout: 35000 });
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