// pages/AuthPage.js
const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput      = page.locator('input[name="username"]');
    this.passwordInput      = page.locator('input[name="password"]');
    this.loginButton        = page.locator('input[value="Log In"]');
    this.loginPanel         = page.locator('#loginPanel');
    this.registerLink       = page.locator('a[href*="register"]');
    this.logoutLink         = page.locator('a[href*="logout"]');
    this.accountServicesTitle = page.locator('#accountServices h2, #accountServices .title, #leftPanel h2').first();
    this.loginError         = page.locator('#rightPanel .error, p.error');
    this.firstNameInput     = page.locator('input[id="customer.firstName"]');
    this.registerSubmit     = page.locator('input[value="Register"]');
  }

  async gotoHome() {
    await this.navigate('/parabank/index.htm');
    await this.loginPanel.waitFor({ state: 'visible', timeout: 30000 });
  }

  async gotoRegister() {
    await this.navigate('/parabank/register.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    await this.navigate('/parabank/index.htm');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
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