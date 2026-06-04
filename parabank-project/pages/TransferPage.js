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
    // transfer.htm is AngularJS — the form renders AFTER domcontentloaded.
    await this.amountInput.waitFor({ state: 'visible', timeout: 35000 });
  }

  async getFromAccountCount() {
    return await this.fromAccountSelect.locator('option').count();
  }

  async getToAccountCount() {
    return await this.toAccountSelect.locator('option').count();
  }

  
  async transfer(amount) {
    await this.amountInput.fill(String(amount));

    
    const beforeText = await this.rightPanel.innerText().catch(() => '');

    await this.transferButton.click();
    await this.page.waitForLoadState('domcontentloaded');

    
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

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }
}

module.exports = TransferPage;