// pages/AuthPage.js

const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton   = page.locator('input[type="submit"][value="Log In"]');
    this.logoutLink    = page.locator('a[href*="logout"]');
  }

  async login(username, password) {
    await this.navigate('/parabank/index.htm');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = AuthPage;
