// pages/TransactionPage.js

const BasePage = require('./BasePage');

class TransactionPage extends BasePage {
  constructor(page) {
    super(page);

    // Account activity page elements
    this.pageTitle          = page.locator('#rightPanel h1.title').first();
    this.accountTable       = page.locator('#accountTable');
    this.accountLinks       = page.locator('#accountTable a');
    this.transactionTable   = page.locator('#transactionTable');
    this.transactionRows    = page.locator('#transactionTable tbody tr');
    this.transactionLinks   = page.locator('#transactionTable tbody tr td a');

    // Filter form elements
    this.activitySelect     = page.locator('#month');
    this.typeSelect         = page.locator('#transactionType');
    this.findButton         = page.locator('input[value="Go"]');

    // Amount filter
    this.amountInput        = page.locator('#amount');
    this.findByAmountButton = page.locator('input[value="Find Transactions"]');

    // Nav
    this.overviewLink       = page.locator('a[href*="overview"]');
    this.rightPanel         = page.locator('#rightPanel');
  }

  async gotoOverview() {
    await this.navigate('/parabank/overview.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickFirstAccount() {
    await this.accountLinks.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTransactionRowCount() {
    return await this.transactionRows.count();
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }
}

module.exports = TransactionPage;
