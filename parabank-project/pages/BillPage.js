// pages/BillPage.js
const BasePage = require('./BasePage');

class BillPage extends BasePage {
  constructor(page) {
    super(page);
    this.payeeNameInput     = page.locator('input[name="payee.name"]');
    this.addressInput       = page.locator('input[name="payee.address.street"]');
    this.cityInput          = page.locator('input[name="payee.address.city"]');
    this.stateInput         = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput       = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput         = page.locator('input[name="payee.phoneNumber"]');
    this.accountInput       = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput        = page.locator('input[name="amount"]');
    this.fromAccountSelect  = page.locator('select[name="fromAccountId"]');

    // FIX TC-BILL-08:
    // ParaBank renders the Send Payment button inside an AngularJS-controlled
    // form. The button is a standard <input type="submit"> but it appears AFTER
    // Angular finishes bootstrapping. Using a more permissive selector that
    // matches both the value attribute AND a CSS class fallback ensures the
    // locator resolves even when Angular mutates the DOM slightly between runs.
    this.sendButton         = page.locator('input[value="Send Payment"], button:has-text("Send Payment")');

    this.rightPanel         = page.locator('#rightPanel');
    this.billPayLink        = page.locator('a[href*="billpay"]');
  }

  async gotoBillPay() {
    await this.navigate('/parabank/billpay.htm');
    await this.page.waitForLoadState('domcontentloaded');

    // ParaBank billpay uses AngularJS — the form is injected AFTER domcontentloaded.
    // Waiting for payeeNameInput confirms Angular has rendered the form.
    await this.payeeNameInput.waitFor({ state: 'visible', timeout: 35000 });

    // FIX TC-BILL-08 & TC-BILL-09:
    // The Send Payment button and fromAccountSelect are both rendered by Angular
    // but the fromAccountSelect OPTIONS are populated by a separate AJAX call
    // (GET /services/bank/customers/:id/accounts). We must wait for both the
    // select itself AND at least one option to be present before returning.
    // Without this wait, TC-BILL-08 times out waiting for sendButton and
    // TC-BILL-09/10 see an empty dropdown.
    await this.sendButton.waitFor({ state: 'visible', timeout: 35000 });
    await this.fromAccountSelect.waitFor({ state: 'visible', timeout: 35000 });
    await this.page.waitForFunction(
      () => {
        const sel = document.querySelector('select[name="fromAccountId"]');
        return sel && sel.options && sel.options.length > 0;
      },
      { timeout: 35000 }
    );
  }

  async getFromAccountCount() {
    return await this.fromAccountSelect.locator('option').count();
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }

  async fillPayeeDetails(data) {
    await this.payeeNameInput.fill(data.name);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneInput.fill(data.phone);
    await this.accountInput.fill(data.account);
    await this.verifyAccountInput.fill(data.account);
    await this.amountInput.fill(data.amount);
  }
}

module.exports = BillPage;