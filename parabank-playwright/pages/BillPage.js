// pages/BillPage.js
// Candidate: Siva

const BasePage = require('./BasePage');

class BillPage extends BasePage {
  constructor(page) {
    super(page);

    this.payeeNameInput    = page.locator('input[name="payee.name"]');
    this.addressInput      = page.locator('input[name="payee.address.street"]');
    this.cityInput         = page.locator('input[name="payee.address.city"]');
    this.stateInput        = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput      = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput        = page.locator('input[name="payee.phoneNumber"]');
    this.accountInput      = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput       = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.sendButton        = page.locator('input[value="Send Payment"]');
    this.rightPanel        = page.locator('#rightPanel');
    this.billPayLink       = page.locator('a[href*="billpay"]');
  }

  async gotoBillPay() {
    await this.navigate('/parabank/billpay.htm');
    await this.page.waitForLoadState('domcontentloaded');
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
