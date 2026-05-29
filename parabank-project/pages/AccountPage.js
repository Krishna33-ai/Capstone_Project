// pages/AccountPage.js
const BasePage = require('./BasePage');

class AccountPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle            = page.locator('#rightPanel h1.title').first();
    this.accountTable         = page.locator('#accountTable');
    this.accountRows          = page.locator('#accountTable tr').filter({ hasNot: page.locator('th') });
    this.accountLinks         = page.locator('#accountTable a');
    this.accountsOverviewLink = page.locator('a[href*="overview"]');
    this.accountNumber        = page.locator('#accountDetails #accountId');
    this.accountType          = page.locator('#accountDetails #accountType');
    this.accountBalance       = page.locator('#accountDetails #balance');
    this.availableBalance     = page.locator('#accountDetails #availableBalance');
  }

  async gotoOverview() {
    await this.accountsOverviewLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickFirstAccount() {
    await this.accountLinks.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getRowCount() { return await this.accountRows.count(); }

  async clickAccountsOverviewLink() {
    await this.accountsOverviewLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = AccountPage;
