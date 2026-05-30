// pages/TransactionPage.js
const BasePage = require('./BasePage');

class TransactionPage extends BasePage {
  constructor(page) {
    super(page);
    this.rightPanel        = page.locator('#rightPanel');
    this.accountTable      = page.locator('#accountTable');
    this.accountLinks      = page.locator('#accountTable a');
    this.transactionTable  = page.locator('#transactionTable');
    this.activitySelect    = page.locator('select[id="month"]');
    this.typeSelect        = page.locator('select[id="transactionType"]');
    this.findButton        = page.locator('input[value="Go"]');
    this.overviewLink      = page.locator('a[href*="overview"]');
  }

  async gotoOverview() {
    await this.navigate('/parabank/overview.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // FIX TC-TXN-01/02/05/07/08/09/10:
  // The account activity page is AngularJS-rendered. After domcontentloaded,
  // Angular still bootstraps and injects #transactionTable, select#month,
  // and select#transactionType into the DOM asynchronously.
  // We wait for both filter selects to confirm Angular is fully done.
  async clickFirstAccount() {
    await this.accountLinks.first().click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('#rightPanel', { state: 'visible', timeout: 60000 });

    // Both filter selects are always rendered on the activity page regardless
    // of transaction count — waiting for them confirms Angular is complete.
    await this.page.waitForFunction(
      () => {
        const monthSel = document.querySelector('select#month');
        const typeSel  = document.querySelector('select#transactionType');
        return monthSel && typeSel;
      },
      { timeout: 60000 }
    );
  }

  async getTransactionRowCount() {
    return await this.transactionTable.locator('tbody tr').count();
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }
}

module.exports = TransactionPage;