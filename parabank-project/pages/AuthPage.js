// pages/AuthPage.js
const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput        = page.locator('input[name="username"]');
    this.passwordInput        = page.locator('input[name="password"]');
    this.loginButton          = page.locator('input[type="submit"][value="Log In"]');
    this.loginError           = page.locator('#rightPanel .error');
    this.loginPanel           = page.locator('#loginPanel');
    this.logoutLink           = page.locator('a[href*="logout"], a[href*="Logout"]').first();
    this.registerLink         = page.locator('a[href*="register"]');
    this.firstNameInput       = page.locator('input[id="customer.firstName"]');
    this.lastNameInput        = page.locator('input[id="customer.lastName"]');
    this.addressInput         = page.locator('input[id="customer.address.street"]');
    this.cityInput            = page.locator('input[id="customer.address.city"]');
    this.stateInput           = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput         = page.locator('input[id="customer.address.zipCode"]');
    this.phoneInput           = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput             = page.locator('input[id="customer.ssn"]');
    this.regUsernameInput     = page.locator('input[id="customer.username"]');
    this.regPasswordInput     = page.locator('input[id="customer.password"]');
    this.regConfirmInput      = page.locator('input[id="repeatedPassword"]');
    this.registerSubmit       = page.locator('input[value="Register"]');
    this.accountServicesTitle = page.locator('#leftPanel h2').first();
    this.rightPanelTitle      = page.locator('#rightPanel h1.title');
  }

  async gotoHome() {
    await this.navigate('/parabank/index.htm');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 90000 });
  }

  async gotoRegister() {
    await this.navigate('/parabank/register.htm');
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 90000 });
  }

  async login(username, password) {
    await this.gotoHome();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logout() {
    await this.logoutLink.click();
    await this.page.waitForURL(/index|login/, { timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded');
    await this.loginPanel.waitFor({ state: 'visible', timeout: 20000 });
  }

  async register(user) {
    await this.gotoRegister();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.addressInput.fill(user.address);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.zipCodeInput.fill(user.zipCode);
    await this.phoneInput.fill(user.phone);
    await this.ssnInput.fill(user.ssn);
    await this.regUsernameInput.fill(user.username);
    await this.regPasswordInput.fill(user.password);
    await this.regConfirmInput.fill(user.confirmPassword);
    await this.registerSubmit.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isLoggedIn() { return this.logoutLink.isVisible(); }

  async getErrorText() {
    const visible = await this.loginError.isVisible();
    return visible ? this.loginError.innerText() : '';
  }
}

module.exports = AuthPage;