// pages/AuthPage.js
const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput        = page.locator('input[name="username"]');
    this.passwordInput        = page.locator('input[name="password"]');
    this.loginButton          = page.locator('input[value="Log In"]');
    this.loginPanel           = page.locator('#loginPanel');
    this.registerLink         = page.locator('a[href*="register"]');
    this.logoutLink           = page.locator('a[href*="logout"]');
    this.accountServicesTitle = page.locator('#accountServices h2, #accountServices .title, #leftPanel h2').first();
    this.loginError           = page.locator('#rightPanel .error, p.error');
    this.firstNameInput       = page.locator('input[id="customer.firstName"]');
    this.registerSubmit       = page.locator('input[value="Register"]');
  }

  async gotoHome() {
    await this.navigate('/parabank/index.htm');
    // ROOT CAUSE FIX: increased timeout from 30 s → 60 s.
    // ParaBank's public server is shared and slow — the login panel can take
    // well over 30 s to appear in CI (GitHub Actions) or under heavy load.
    // 60 s matches the pattern used for Angular page waits elsewhere.
    await this.loginPanel.waitFor({ state: 'visible', timeout: 60000 });
  }

  async gotoRegister() {
    await this.navigate('/parabank/register.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Logs in with retry logic.
   *
   * ROOT CAUSE FIX (TC-BILL-07, TC-LOAN-03/04/05/06, TC-PROF-01/02,
   *                  TC-TXN-01/02, TC-TRF-15/16, and many others):
   *
   * Error seen: "TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
   *              Call log: waiting for locator('input[name="username"]') to be visible"
   *
   * This means navigate() succeeded (page loaded) but ParaBank's server was so
   * slow that the login panel took >30 s to render. Increasing the waitFor
   * timeout to 60 s and adding a full login retry (re-navigate + re-fill) covers
   * both transient slowness and the occasional 502 that navigate() silently
   * recovered from (leaving the browser on an error page with no login panel).
   */
  async login(username, password) {
    const MAX_RETRIES = 3;
    let lastErr;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.navigate('/parabank/index.htm');

        // Wait up to 60 s — ParaBank CI can be this slow
        await this.usernameInput.waitFor({ state: 'visible', timeout: 60000 });
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        return; // login submitted successfully
      } catch (err) {
        lastErr = err;
        if (attempt < MAX_RETRIES) {
          // Wait before retrying so the server has time to recover
          await this.page.waitForTimeout(4000);
        }
      }
    }
    throw lastErr;
  }

  async logout() {
    await this.logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isLoggedIn() {
    try {
      await this.logoutLink.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = AuthPage;