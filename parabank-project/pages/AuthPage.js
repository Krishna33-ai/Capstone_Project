// pages/AuthPage.js

const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton   = page.locator('input[value="Log In"]');
  }

  async login(username, password) {
    await this.navigate('/parabank/index.htm');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = AuthPage;