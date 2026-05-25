// pages/AuthPage.js

const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);

    this.usernameInput  = page.locator('input[name="username"]');
    this.passwordInput  = page.locator('input[name="password"]');
    this.loginButton    = page.locator('input[type="submit"][value="Log In"]');
    this.loginError     = page.locator('.error');
    this.loginPanel     = page.locator('#loginPanel');
    this.logoutLink     = page.locator('a[href*="logout"]');
    this.registerLink   = page.locator('a[href*="register"]');

    this.firstNameInput   = page.locator('input[id="customer.firstName"]');
    this.lastNameInput    = page.locator('input[id="customer.lastName"]');
    this.addressInput     = page.locator('input[id="customer.address.street"]');
    this.cityInput        = page.locator('input[id="customer.address.city"]');
    this.stateInput       = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput     = page.locator('input[id="customer.address.zipCode"]');
    this.phoneInput       = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput         = page.locator('input[id="customer.ssn"]');
    this.regUsernameInput = page.locator('input[id="customer.username"]');
    this.regPasswordInput = page.locator('input[id="customer.password"]');
    this.regConfirmInput  = page.locator('input[id="repeatedPassword"]');
    this.registerSubmit   = page.locator('input[value="Register"]');

    this.accountServicesTitle = page.locator('#leftPanel h2').first();
    this.rightPanelTitle      = page.locator('#rightPanel h1.title');
  }

  async gotoHome()     { await this.navigate('/parabank/index.htm'); }
  async gotoRegister() { await this.navigate('/parabank/register.htm'); }

  async login(username, password) {
    await this.gotoHome();
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
    return this.logoutLink.isVisible();
  }

  async getErrorText() {
    const visible = await this.loginError.isVisible();
    return visible ? this.loginError.innerText() : '';
  }
}

module.exports = AuthPage;
