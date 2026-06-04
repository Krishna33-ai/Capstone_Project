// pages/LoanPage.js
const BasePage = require('./BasePage');

class LoanPage extends BasePage {
  constructor(page) {
    super(page);
    this.loanAmountInput   = page.locator('input[id="amount"]');
    this.downPaymentInput  = page.locator('input[id="downPayment"]');
    this.fromAccountSelect = page.locator('select[id="fromAccountId"]');
    this.applyButton       = page.locator('input[value="Apply Now"]');
    this.rightPanel        = page.locator('#rightPanel');

    
    this.loanLink = page.locator(
      'a:has-text("Request Loan"), a[href*="requestloan"]'
    ).first();
  }

  async gotoLoan() {
    await this.navigate('/parabank/requestloan.htm');
    await this.page.waitForLoadState('domcontentloaded');

    
    await this.loanAmountInput.waitFor({ state: 'visible', timeout: 60000 });

    
    await this.fromAccountSelect.waitFor({ state: 'visible', timeout: 60000 });
    await this.page.waitForFunction(
      () => {
        const sel = document.querySelector('select[id="fromAccountId"]');
        return sel && sel.options && sel.options.length > 0;
      },
      { timeout: 60000 }
    );
  }

  async getFromAccountCount() {
    return await this.fromAccountSelect.locator('option').count();
  }

  async getRightPanelText() {
    return await this.rightPanel.innerText();
  }

  
  async applyForLoan(amount, downPayment) {
    await this.loanAmountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);

    const beforeText = await this.rightPanel.innerText().catch(() => '');

    await this.applyButton.click();
    await this.page.waitForLoadState('domcontentloaded');

    
    await this.page.waitForFunction(
      (before) => {
        const el = document.querySelector('#rightPanel');
        if (!el) return false;
        const current = el.innerText ? el.innerText.trim() : '';
        return current.length > 0 && current !== before.trim();
      },
      beforeText,
      { timeout: 60000 }
    );
  }
}

module.exports = LoanPage;