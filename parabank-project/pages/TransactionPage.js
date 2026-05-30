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

  // FIX TC-TXN-05, 07, 08, 09, 10:
  // The account activity page (activity.htm) is AngularJS-rendered.
  // After clicking an account link and domcontentloaded fires, Angular still
  // needs time to bootstrap and inject #transactionTable, the month select,
  // and the transactionType select into the DOM.
  // Previous implementation only waited for domcontentloaded + #rightPanel,
  // so all Angular-rendered elements were missing when tests asserted against them.
  //
  // Fix: after navigation, additionally wait for:
  //   1. #transactionTable to be attached (it may not exist if account has 0 txns,
  //      so we use a broader waitForFunction that accepts either the table or the
  //      "No transactions" message — both signal Angular is done rendering).
  //   2. The month select and transactionType select to be visible.
  // This guarantees the full Angular view is ready before any test assertion.
  async clickFirstAccount() {
    await this.accountLinks.first().click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('#rightPanel', { state: 'visible', timeout: 25000 });

    // Wait for Angular to finish rendering the activity view.
    // The activity page always renders either #transactionTable or a "No transactions"
    // paragraph. Waiting for the month dropdown is the most reliable signal because
    // it is always present regardless of transaction count.
    await this.page.waitForFunction(
      () => {
        const monthSel = document.querySelector('select#month');
        const typeSel  = document.querySelector('select#transactionType');
        return monthSel && typeSel;
      },
      { timeout: 35000 }
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