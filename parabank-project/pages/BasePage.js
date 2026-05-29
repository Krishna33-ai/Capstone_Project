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

    // FIX FOR TC-TRF-09 / TC-TRF-10:
    // ParaBank rejects transfers where fromAccountId === toAccountId with a
    // silent error — the rightPanel never shows the word "transfer complete".
    // We must ensure toAccount differs from fromAccount.
    // Strategy: read all option values from both selects and pick a toAccount
    // that is different from the currently selected fromAccount value.
    const fromValue = await this.fromAccountSelect.inputValue();
    const toOptions = await this.toAccountSelect.locator('option').all();

    for (const opt of toOptions) {
      const val = await opt.getAttribute('value');
      if (val && val !== fromValue) {
        await this.toAccountSelect.selectOption(val);
        break;
      }
    }

    await this.transferButton.click();
    // Wait for Angular to render the result — domcontentloaded fires before
    // AngularJS updates #rightPanel, so we wait for the result heading.
    await this.rightPanel.waitFor({ state: 'visible', timeout: 35000 });
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }
}

module.exports = TransferPage;