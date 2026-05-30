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

  // FIX TC-TRF-11, 12, 13:
  // After clicking Transfer (for any amount — including decimal, zero, or empty),
  // ParaBank processes the request via AngularJS asynchronously.
  // For VALID transfers: Angular replaces the form with a success message panel.
  // For INVALID/ZERO amounts: Angular shows a validation error in #rightPanel.
  // In both cases, waitForLoadState('domcontentloaded') resolves immediately
  // because there is no full page navigation — Angular just mutates the DOM.
  // The old implementation only waited for domcontentloaded, so the rightPanel
  // still showed the form content (non-empty), but tests expecting "transfer"
  // text in the result would fail because Angular hadn't updated it yet.
  //
  // Fix: use waitForFunction to poll until #rightPanel changes to show a result.
  // We snapshot the panel text before clicking and wait until it changes, which
  // correctly handles success, error, and validation failure cases alike.
  async transfer(amount) {
    await this.amountInput.fill(String(amount));

    // Snapshot current rightPanel text so we can detect when Angular updates it
    const beforeText = await this.rightPanel.innerText().catch(() => '');

    await this.transferButton.click();
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for Angular to update #rightPanel with the transfer result.
    // This covers: success message, error message, and validation errors.
    await this.page.waitForFunction(
      (before) => {
        const el = document.querySelector('#rightPanel');
        if (!el) return false;
        const current = el.innerText ? el.innerText.trim() : '';
        // Accept if content changed OR if "transfer" appears (success page)
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